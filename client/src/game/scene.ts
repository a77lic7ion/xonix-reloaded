// Liquid Blueprint reminder: Babylon presents one sharp, framed 2D instrument surface with all rules owned by GameWorld.
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GameWorld } from "./GameWorld";
import { InputManager } from "./InputManager";
import { MusicManager } from "./MusicManager";
import { SfxManager } from "./SfxManager";
import { FeedbackManager } from "./FeedbackManager";
import { SURFACE } from "./CanvasRenderer";

export interface GameHandle {
  scene: Scene;
  dispose(): void;
}

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 1);

  const camera = new FreeCamera("xonix-camera", new Vector3(0, 0, -10), scene);
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  camera.setTarget(Vector3.Zero());
  camera.minZ = 0.1;
  camera.maxZ = 100;
  scene.activeCamera = camera;

  const texture = new DynamicTexture("xonix-surface", { width: SURFACE.width, height: SURFACE.height }, scene, false);
  texture.hasAlpha = false;
  texture.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
  texture.vScale = -1;
  texture.vOffset = 1;
  const material = new StandardMaterial("xonix-surface-material", scene);
  material.diffuseTexture = texture;
  material.emissiveTexture = texture;
  material.specularColor = new Color3(0, 0, 0);
  material.disableLighting = true;
  material.backFaceCulling = false;
  const plane = MeshBuilder.CreatePlane("xonix-surface-plane", { width: 4 / 3, height: 1 }, scene);
  plane.material = material;

  const params = new URLSearchParams(window.location.search);
  const isDemo = params.has("demo");
  const demoStage = Number(params.get("stage") ?? "1");
  const world = new GameWorld(isDemo, Number.isFinite(demoStage) ? demoStage : 1);
  void fetch("/manus-storage/xonix-title-hero_3e08153a.jpg")
    .then((response) => response.blob())
    .then((blob) => createImageBitmap(blob))
    .then((image) => world.renderer.setTitleArt(image))
    .catch(() => {
      // The text-and-vector fallback title remains usable if the hero art is unavailable.
    });
  const music = new MusicManager((title) => world.setCurrentTrack(title));
  const sfx = new SfxManager();
  const feedback = new FeedbackManager();
  let lastSoundEventId = 0;
  const syncMusic = () => {
    music.setEnabled(world.musicEnabled);
    music.ensurePlaying();
  };
  const syncSfx = () => {
    sfx.setEnabled(world.sfxEnabled);
    if (world.soundEvent && world.soundEvent.id !== lastSoundEventId) {
      lastSoundEventId = world.soundEvent.id;
      sfx.play(world.soundEvent.name);
    }
  };
  const syncFeedback = () => {
    feedback.setEnabled(world.sfxEnabled);
    feedback.consume(world.effect);
  };
  const input = new InputManager(canvas, {
    requestDirection: (direction) => { world.requestDirection(direction); syncMusic(); syncSfx(); },
    confirm: () => { world.confirm(); syncMusic(); syncSfx(); },
    togglePause: () => world.togglePause(),
    toggleSettings: () => { world.toggleSettings(); syncMusic(); syncSfx(); },
    handleTap: (x, y) => { world.handleTap(x, y); syncMusic(); syncSfx(); },
    handleTextInput: (key) => world.handleTextInput(key),
  });
  const context = texture.getContext() as CanvasRenderingContext2D;
  let disposed = false;

  const resizeCamera = () => {
    const ratio = engine.getRenderWidth() / Math.max(1, engine.getRenderHeight());
    const frameRatio = 4 / 3;
    const viewWidth = ratio >= frameRatio ? ratio : frameRatio;
    const viewHeight = ratio >= frameRatio ? 1 : frameRatio / ratio;
    const shake = feedback.offset(world.visualTime);
    camera.orthoLeft = -viewWidth / 2 + shake.x;
    camera.orthoRight = viewWidth / 2 + shake.x;
    camera.orthoTop = viewHeight / 2 + shake.y;
    camera.orthoBottom = -viewHeight / 2 + shake.y;
  };
  resizeCamera();

  scene.onBeforeRenderObservable.add(() => {
    if (disposed) return;
    world.update(scene.getEngine().getDeltaTime() / 1000);
    syncSfx();
    syncFeedback();
    resizeCamera();
    world.render(context);
    texture.update(false);
  });

  return {
    scene,
    dispose: () => {
      disposed = true;
      input.dispose();
      music.dispose();
      sfx.dispose();
      feedback.dispose();
      scene.dispose();
    },
  };
}
