import React, { useEffect } from 'react'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import normal_map from '../materials/NormalMap.png'

const Three = props => {

    useEffect(() => {
        //constants
        const gui = new GUI();
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        const canvas = document.querySelector('#webgl');

        //renderer
        const renderer = new THREE.WebGL1Renderer({
            canvas: canvas,
            alpha: true
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        //scene
        const scene = new THREE.Scene();

        //camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.z = 2;

        //loaders
        const texture_loader = new THREE.TextureLoader();
        const normal_texture = texture_loader.load(normal_map);

        //objects
        const geometry = new THREE.SphereBufferGeometry(.7, 64, 64);
        const material = new THREE.MeshStandardMaterial();
        material.color = new THREE.Color('white');
        material.metalness = 0.7;
        material.roughness = 0.1;
        material.normalMap = normal_texture;

        const sphere = new THREE.Mesh(geometry, material);

        //lights

        const createLight = (name, color, x, y, z, intensity) => {
            const guiFolder = gui.addFolder(name);

            const pointLight = new THREE.PointLight(color, intensity);
            pointLight.position.set(x, y, z);

            //debug
            guiFolder.add(pointLight.position, 'x').min(-6).max(6).step(0.01);
            guiFolder.add(pointLight.position, 'y').min(-3).max(3).step(0.01);
            guiFolder.add(pointLight.position, 'z').min(-3).max(3).step(0.01);
            guiFolder.add(pointLight, 'intensity').min(0).max(10).step(0.01);

            return pointLight;
        }

        const pointLight = createLight('redLight', 0xff0000, -2.51, 3, -0.79, 1.37);
        const pointLight2 = createLight('blueLight', 0x0586ff, 1.33, -2.51, -0.53, 1.37);

        //resize
        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(window.devicePixelRatio);
        });

        //helpers
        // const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1);

        //implementation
        scene.add(sphere, pointLight, pointLight2);

        renderer.render(scene, camera);

        //animation
        document.addEventListener('mousemove', mouseMove);

        let x, y, targetX, targetY = 0;

        function mouseMove (event) {
            x = event.clientX - window.innerWidth / 2;
            y = event.clientY  - window.innerHeight / 2;
        }

        const clock = new THREE.Clock();
        const tick = () => {
            targetX = x * 0.001;
            targetY = y * 0.001;

            window.requestAnimationFrame(tick);

            sphere.rotation.y = 0.5 * clock.getElapsedTime();
            sphere.rotation.x = 0.5 * clock.getElapsedTime();

            sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
            sphere.rotation.x += 0.5 * (targetY - sphere.rotation.x);

            renderer.render(scene, camera);
        };

        tick();

    }, [])

    return (
        <div>
            <canvas id="webgl"></canvas>
        </div>
    )
}


export default Three
