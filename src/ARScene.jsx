import React, { useEffect } from 'react';
import { Engine, Scene } from '@babylonjs/core';
import '@babylonjs/loaders'; // Required to load 3D models like .glb or .gltf
import { Vector3, FreeCamera, HemisphericLight, Axis } from '@babylonjs/core';
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';

const ARScene = () => {
  useEffect(() => {
    const canvas = document.getElementById('renderCanvas');

    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    // Initialize Babylon engine and scene
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // Create a basic camera and set its position
    const camera = new FreeCamera('camera', new Vector3(0, 2, -20), scene);
    camera.attachControl(canvas, true);
    camera.speed = 0.5;
    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D

    // Add a light to the scene
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    // Zoom with mouse wheel
    const zoomSensitivity = 2;
    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      const zoomAmount = event.deltaY * 0.01 * zoomSensitivity;
      camera.position.addInPlace(camera.getDirection(Axis.Z).scale(zoomAmount));
    });

    // Load the 3D model
    const modelUrl = 'https://camweara-customers.s3.ap-south-1.amazonaws.com/Assignment/ring_assessment.glb';
    SceneLoader.ImportMeshAsync('', modelUrl, '', scene)
      .then((result) => {
        const mesh = result.meshes[0];
        mesh.position.y = 0;
        mesh.scaling.scaleInPlace(0.02);
        console.log('Model loaded');
      })
      .catch((error) => {
        console.error('Error loading model:', error);
      });

    // WebXR AR setup
    const enterAR = async () => {
      try {
        const xr = await WebXRDefaultExperience.CreateAsync(scene, {
          // Specify immersive AR mode explicitly
          uiOptions: {
            sessionMode: 'immersive-ar',
          },
        });
        console.log('WebXR AR experience is ready', xr);

        xr.baseExperience.onStateChangedObservable.add((state) => {
          console.log('WebXR state changed:', state);
          if (state === 1) {
            console.log('AR session is active.');
          } else {
            console.log('AR session not active.');
          }
        });
      } catch (error) {
        console.error('Failed to create WebXR experience:', error);
      }
    };

    // Add a button to trigger AR mode
    const enterARButton = document.createElement('button');
    enterARButton.innerText = 'Enter AR';
    enterARButton.style.position = 'absolute';
    enterARButton.style.bottom = '10px';
    enterARButton.style.left = '10px';
    document.body.appendChild(enterARButton);
    enterARButton.addEventListener('click', enterAR);

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize the canvas when window size changes
    window.addEventListener('resize', () => {
      engine.resize();
    });

    // Clean up on component unmount
    return () => {
      engine.dispose();
      enterARButton.remove(); // Clean up the button
      window.removeEventListener('resize', engine.resize);
    };
  }, []);

  return <canvas id="renderCanvas" style={{ width: '100vw', height: '100vh' }} />;
};

export default ARScene;
