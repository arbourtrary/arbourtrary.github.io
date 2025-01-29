<script defer>
    import { section, bgColor, textColor2, white } from "../store.js"
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { clamp } from "../utils/math.js";
    import { hexToRgb } from "../utils/color.js";

    import * as THREE from 'three';
    // TODO: generalize to have this extend a platonic solid gallery component
    export let platonicSolid = "dodecahedron"
    export let modelFilename = `models/${platonicSolid}.glb`
    export let dataFilename = "";
    export let scrollY = 0;

    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';    

    let innerWidth = window.innerWidth;
    let numberOfSides = getNumberOfSides(platonicSolid);
    let drawn = false;
    let initiated = false;
    let canvas;
    let scene;
    let camera;
    let mesh;
    let actualGroup;
    let renderer;
    let angles;
    let title;
    let description;
    let publication;
    let url;
    let year;
    let awards;
    let awardsShort;
    let tags;
    let gallery;
    let foreground;
    let edges;
    let prevIndex = 0;
    let index = 0;
    let unraveledFaces = [];
    let projects = [];
    let hover = false;
    let hoverScale = 5;

    const loader = new GLTFLoader();

    let path;
    let pathLength;
    let dashArray;
    let eraserPath;
    let scrollProgress = 0;
    let piecewiseProgress = 0;

    // Specific mapping to link up minimap path with dodecahedron side rotations
    const piecewisePoints = [0, 0.047, 0.145, 0.238, 0.326, 0.415, 0.502, 0.593, 0.687, 0.776, 0.871, 0.958, 1]
    const lerpPoints = [0, 0.083, 0.167,0.25, 0.333, 0.417, 0.5, 0.583, 0.667, 0.75, 0.833, 0.917, 1]

    $: if (projects.length) {
        title = projects[0].title;
        description = projects[0].description;
        publication = projects[0].publication;
        url = projects[0].url;
        year = projects[0].year;
        awards = projects[0].awards.join(" <div style='height: 5px'></div>");
        awardsShort = projects[0].awardsShort.join(" &ensp;");
        tags = projects[0].tags.join(", ");
    }
    

    onMount(async () => {
        unraveledFaces = [...document.querySelectorAll(".pentagon")];
        projects = await loadJSON(dataFilename);
    });

    const setPathLength = () => {
        pathLength = path.getTotalLength();
        dashArray = [pathLength, pathLength];
    };

    function calculateScrollPercentage(element, scrollY, offset=0) {
      const elementOffsetTop = -1 * element.getBoundingClientRect().top;
      const elementHeight = element.clientHeight;
      const windowHeight = window.outerHeight;
      const offsetHeight = elementHeight * offset;
      let scrollPercentage = clamp((elementOffsetTop - offsetHeight) / (elementHeight - windowHeight), 0, 1);
      return scrollPercentage
    }

    function getNumberOfSides(platonicSolid) {
        switch (platonicSolid) {
            case "tetrahedron":
                return 4;
            case "cube":
                return 6;
            case "octahedron":
                return 8;
            case "dodecahedron":
                return 12;
            case "icosahedron":
                return 20;
            default:
                return 4;
        }
    }

    function getGeometry(platonicSolid) {
        switch (platonicSolid) {
            case "tetrahedron":
                return new THREE.TetrahedronGeometry(5);
            case "cube":
                return new THREE.BoxGeometry(5, 5, 5);
            case "octahedron":
                return new THREE.OctahedronGeometry(5);
            case "dodecahedron":
                return new THREE.DodecahedronGeometry(5);
            case "icosahedron":
                return new THREE.IcosahedronGeometry(5);
            default:
                return new THREE.TetrahedronGeometry(5, 0);
        }
    }

    function createMaterial(texture, perlinTexture=null) {
        const uniforms = {
          uTexture: {
              value: texture
          },
          uTime: {
              value: .1
          },
          uFogColor: {
              value: new THREE.Color(hexToRgb($bgColor))
          },
          uFogNear: {
              value: 10
          },
          uFogFar: {
              value: 15
          },
          uProgress : {
            value: 0
          },
          offset: {
              value: 1
          },
          shifting: {
              value: 0
          },
          count: {
            value: 2
          }
        };


        const vertexShader = () => {
         return `
            attribute vec2 uv;
            attribute vec4 position;
            uniform float uProgress;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            varying float vFogDepth;
            varying float vProgress;
            varying vec2 vUv; 

            void main() {
                vProgress = uProgress;
                vUv = uv;
                vec4 modelViewPosition = modelViewMatrix * position;
                gl_Position = projectionMatrix * modelViewPosition;
                vFogDepth = - modelViewPosition.z;
            }
          `
        }


        // float radius = sqrt(pow((vUv.x - 0.5), 2.0) + pow((vUv.y - 0.5), 2.0));
        // float shiftedRadius = clamp(radius - 0.36, 0.0, 0.36) * 5.0;
        // float radialOpacity = 1.0 - shiftedRadius * 1.;
        // clamp(progress, 0.1, radialOpacity);
        const fragmentShader = () => {
          return `
            precision lowp float;
            uniform float uFogNear;
            uniform float uFogFar;
            uniform vec3 uFogColor;
            uniform sampler2D uTexture;
            varying float vFogDepth;
            varying float vProgress;
            varying vec2 vUv;

            void main()
            {
                vec4 color = texture2D(uTexture, vUv);
                vec4 colorStatic = texture2D(uTexture, vUv);
                float grayscale = 0.3 * (color.r + .01 ) + 0.59 * (color.g + .01) + 0.11 * (color.b + .01);
                color.r = mix(colorStatic.r, grayscale, 1.0 - vProgress);
                color.g = mix(colorStatic.g, grayscale, 1.0 - vProgress);
                color.b = mix(colorStatic.b, grayscale, 1.0 - vProgress);
                color.a = clamp(vProgress, 0.1, 1.0);

                float fogFactor = smoothstep( uFogNear, uFogFar, vFogDepth );
                gl_FragColor = color;
                gl_FragColor.rgb = mix( gl_FragColor.rgb, uFogColor, fogFactor );

            }
          `
        } 

        const material = new THREE.RawShaderMaterial({
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: uniforms,
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader()
        })
        return material;
    }

    function drawPlatonicSolid(platonicSolid) {
        const fogColor = new THREE.Color(hexToRgb($white));
        const backgroundColor = new THREE.Color(hexToRgb($bgColor));
        const edgeColor = new THREE.Color(hexToRgb($textColor2));
        const width = Math.min(.8 * window.outerHeight, .95 * window.innerWidth);
        const height =  Math.min(.8 * window.outerHeight, .95 * window.innerWidth); 
        const dimension = Math.max(width, height);
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(40, dimension / dimension, 2, 100);
        camera.position.setFromSpherical(new THREE.Spherical().setFromVector3(new THREE.Vector3(0, 0, 15))); 
        camera.lookAt(0,0,0)

        renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            gammaOutput: true
        });
        renderer.setPixelRatio(pixelRatio)
        renderer.setSize(dimension, dimension);
        renderer.setClearColor( backgroundColor, 0);

        // Set up an ambient light
        const intensity = 1;
        const ambientLight = new THREE.AmbientLight(backgroundColor, intensity);
        scene.add(ambientLight);

        // Set up fog color
        const near = 10;
        const far = 17;
        scene.fog = new THREE.Fog(fogColor, near, far);

        angles = [
            {x: 0.57, y: -1.57, z: 0}, // manually modified
            {x: -0.57, y: -1.57, z: 0}, // manually modified
            {x: 0, y: -2.5880182946927484, z: 0}, // 3 to 4 flip
            {x: 2.1243706856919418, y: 0, z: 0}, // 4
            {x: 1.0172219678978514, y: 0, z: 0},
            {x: 0, y: -0.5535743588970451, z: 0},
            {x: 0, y: 0.5535743588970451, z: 0},
            {x: 0.57, y: 1.57, z: 0}, // manually modified
            {x: 0, y: 2.5880182946927484, z: 0}, // 9 to 10 flip
            {x: -2.1243706856919418, y: 0, z: 0}, // 10
            {x: -1.0172219678978514, y: 0, z: 0},
            {x: -0.57, y: 1.57, z: 0} // manually modified
        ]

        const geometry = getGeometry(platonicSolid);
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2});
        edges = new THREE.LineSegments(edgesGeometry, material);
        scene.add(edges);

        const textures = projects.map(project => new THREE.TextureLoader().load(project.image));
        const materials = textures.map((texture) => createMaterial(texture))
        actualGroup = new THREE.Group();

        let faces = []
        loader.load( modelFilename, function ( gltf ) {
            const meshes = []
            gltf.scene.traverse(function(obj){
                if(obj.type === 'Mesh'){
                    meshes.push(obj)
                }
            });

            const orderedMeshes = meshes.sort(function(a, b) {
                return (a.name).localeCompare(b.name)
            });
            for (var k = 0; k < meshes.length; k++) {
                const face = meshes[k]
                face.material = materials[k]
                face.position.set(0,0,0)
                scene.add(face)
                faces.push(face)
                actualGroup.add(face)
            }
            actualGroup.position.set(0,0,0);
            actualGroup.rotation.set(angles[0].x, angles[0].y, angles[0].z);
            edges.rotation.set(angles[0].x, angles[0].y, angles[0].z);

            actualGroup.scale.set(5,5,5)
            scene.add(actualGroup)
            renderer.render(scene, camera);
        }, undefined, function ( error ) {
            console.error( error );
        });

        drawn = true;
    }

    function updateGallery() {
        if ($section === 1 && projects.length && actualGroup.children.length) {
            index = gallery ? Math.floor((scrollY - gallery?.parentElement?.offsetTop) / itemHeight) : 0;
            index = clamp(index, 0, numberOfSides - 1)

            actualGroup.children.filter((child,i) => i != index).forEach((child) => {
                if (child.material.uniforms.uProgress.value > 0) {
                    child.material.uniforms.uProgress.value += (0 - child.material.uniforms.uProgress.value) * 0.05;
                }
            })

            if (index !== prevIndex) {
                const indexData = projects[index];
                if (indexData) {
                    title = indexData.title;
                    description = indexData.description;
                    publication = indexData.publication;
                    url = indexData.url;
                    year = indexData.year;
                    awards = indexData.awards.join(" <div style='height: 5px'></div>");
                    awardsShort = indexData.awardsShort.join(" &ensp;");
                    tags = indexData.tags.join(", ");

                    if (index > prevIndex){
                        unraveledFaces.filter((item, i) => i < index).forEach((item) => {
                            item.style.fillOpacity = 0
                        })
                    } else {
                        unraveledFaces.filter((item, i) => i > index).forEach((item) => {
                            item.style.fillOpacity = 0
                        })
                    }
                    unraveledFaces[index].style.opacity = 1
                    unraveledFaces[index].style.fillOpacity = 1

                }
                prevIndex = index;
            }

            actualGroup.children[index].material.uniforms.uProgress.value += (1 - actualGroup.children[index].material.uniforms.uProgress.value) * 0.04;

            const diff = Math.abs(actualGroup.rotation.x - angles[index].x) + Math.abs(actualGroup.rotation.y - angles[index].y) + Math.abs(actualGroup.rotation.z - angles[index].z)

            if (diff > 0.01) {
                actualGroup.rotation.x += (angles[index].x - actualGroup.rotation.x) * 0.07;
                actualGroup.rotation.y += (angles[index].y - actualGroup.rotation.y) * 0.07;
                actualGroup.rotation.z += (angles[index].z - actualGroup.rotation.z) * 0.07;

                edges.rotation.x += (angles[index].x - edges.rotation.x) * 0.07;
                edges.rotation.y += (angles[index].y - edges.rotation.y) * 0.07;
                edges.rotation.z += (angles[index].z - edges.rotation.z) * 0.07;
            }

            const scaleDiff = Math.abs(actualGroup.scale.x - hoverScale) + Math.abs(actualGroup.rotation.y - hoverScale) + Math.abs(actualGroup.rotation.z - hoverScale)
            if (scaleDiff > 0.01) {
                actualGroup.scale.x += (hoverScale - actualGroup.scale.x) * 0.07;
                actualGroup.scale.y += (hoverScale - actualGroup.scale.y) * 0.07;
                actualGroup.scale.z += (hoverScale - actualGroup.scale.z) * 0.07;
            }
            renderer.render(scene, camera);
        }
        window.requestAnimationFrame(updateGallery);
    };


    window.requestAnimationFrame(() => { updateGallery() })

    $: !drawn && canvas && projects.length && drawPlatonicSolid(platonicSolid);
    $: windowHeight = window.outerHeight;
    $: itemHeight = windowHeight / 1.2
    $: galleryHeight = itemHeight * numberOfSides + windowHeight;

    // Updating the minimap paths
    $: if(foreground) {
        scrollProgress = calculateScrollPercentage(foreground, scrollY)
        piecewiseProgress = clamp(piecewisePoints[index] + (scrollProgress - lerpPoints[index]) / (lerpPoints[index + 1] - lerpPoints[index]) * (piecewisePoints[index + 1] - piecewisePoints[index]), 0, 1)

    }
    $: if (path) {
        path.style.strokeDashoffset = 1 - piecewiseProgress;
        eraserPath.style.strokeDashoffset = 1 - (piecewiseProgress - 1 / numberOfSides);
    }
</script>

<svelte:window bind:innerWidth={innerWidth}/>

<div class="platonic-gallery" bind:this={gallery}>
    <div class="foreground" style={`height: ${galleryHeight}px`} bind:this={foreground}></div>

    <div class="background">
        <div class="details-container">
            <h2>P R O J E C T S</h2>            
            <a href={url} target="_blank" aria-label={`project link to ${title}`}>
                <div class="title"><span class="title-text">{@html title}</span>
                    <div class="external-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </div>
                </div>
            </a>
            <div class="description">{description}</div>
            <div class="details desktop">
                <!-- {#if awards}
                    <div class="detail">
                        <p class="section-subtitle">Awards</p>
                        <p class="detail-description">{@html awards}</p>
                    </div>
                {/if} -->
                <div class="detail">
                    <p class="section-subtitle">Tags</p>
                    <p class="detail-description tags">{@html tags}</p>
                </div>
            </div>
        </div>
        <div class="canvas-container">
                <div class="canvas"> 
                <a href={url} target="_blank" aria-label={`project link to ${title}`} on:mouseenter={() => hoverScale = 5.2 } on:mouseleave={() => hoverScale = 5 }>
                    <div class="hover-circle"></div>
                </a>

                    <div class="counter">{index + 1} / 12</div>
                    <canvas height="800" width="800" bind:this={canvas}></canvas>
                </div>
        <div>
            <div class="unraveled-container">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 527.96284 261.57872"
                    version="1.1"
                    
                    xml:space="preserve"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:svg="http://www.w3.org/2000/svg"
                >
                    <g
                        id="layer1"
                        transform="translate(-0.30301638,-0.43095359)"
                    >
                        <path
                            id="pentagon-1"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.7551409,0.27798701,-0.27798701,1.7551409,136.43801,-96.294659)"
                        />
                        <path
                            id="pentagon-2"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.7551409,-0.27798702,0.27798702,-1.7551409,138.61539,419.71701)"
                        />
                        <path
                            id="pentagon-3"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.2565422,1.2565422,-1.2565422,1.2565422,178.218,-28.624215)"
                        />
                        <path
                            id="pentagon-4"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.5833355,-0.80674972,0.80674972,1.5833355,-41.15203,-126.58232)"
                        />
                        <path
                            id="pentagon-5"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.2565422,1.2565422,-1.2565422,1.2565422,314.61852,-127.79833)"
                        />
                        <path
                            id="pentagon-6"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-0.80674972,1.5833355,-1.5833355,-0.80674972,425.59887,209.91183)"
                        />
                        <path
                            id="pentagon-7"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(0.80674972,-1.5833355,1.5833355,0.80674972,102.97001,52.528782)"
                        />
                        <path
                            id="pentagon-8"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.2565422,-1.2565422,1.2565422,-1.2565422,213.95036,390.23893)"
                        />
                        <path
                            id="pentagon-9"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.5833355,0.80674972,-0.80674972,-1.5833355,569.72092,389.02296)"
                        />
                        <path
                            id="pentagon-10"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.2565422,-1.2565422,1.2565422,-1.2565422,350.3509,291.06486)"
                        />
                        <path
                            id="pentagon-11"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.7551409,0.27798701,-0.27798701,1.7551409,389.95349,-157.27642)"
                        />
                        <path
                            id="pentagon-12"
                            class="pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.7551409,-0.27798702,0.27798702,-1.7551409,392.13086,358.73531)"
                        />

                        <path
                            bind:this={path}
                            on:resize={setPathLength}
                            id="pentagon-route"
                            pathLength="1"
                            stroke-width="3"
                            stroke="#746F67"
                            fill="none" 
                            d="m 137.52669,112.07243 2e-5,99.27748 -84.041698,-61.10194 31.857468,-99.237934 104.54305,0.06382 32.1296,99.174094 84.5386,-38.05529 32.1296,99.17408 104.54307,0.0639 31.85747,-99.23793 -84.04169,-61.101995 v 99.277535"
                        />
                        <path
                            bind:this={eraserPath}
                            on:resize={setPathLength}
                            id="eraser-route"
                            pathLength="1"
                            stroke-width="7"
                            stroke="var(--bg-color)"
                            fill="none" 
                            d="m 137.52669,112.07243 2e-5,99.27748 -84.041698,-61.10194 31.857468,-99.237934 104.54305,0.06382 32.1296,99.174094 84.5386,-38.05529 32.1296,99.17408 104.54307,0.0639 31.85747,-99.23793 -84.04169,-61.101995 v 99.277535"
                        />


                        <path
                            id="outline-pentagon-1"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.7551409,0.27798701,-0.27798701,1.7551409,136.43801,-96.294659)"
                        />
                        <path
                            id="outline-pentagon-2"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.7551409,-0.27798702,0.27798702,-1.7551409,138.61539,419.71701)"
                        />
                        <path
                            id="outline-pentagon-3"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.2565422,1.2565422,-1.2565422,1.2565422,178.218,-28.624215)"
                        />
                        <path
                            id="outline-pentagon-4"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.5833355,-0.80674972,0.80674972,1.5833355,-41.15203,-126.58232)"
                        />
                        <path
                            id="outline-pentagon-5"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.2565422,1.2565422,-1.2565422,1.2565422,314.61852,-127.79833)"
                        />
                        <path
                            id="outline-pentagon-6"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-0.80674972,1.5833355,-1.5833355,-0.80674972,425.59887,209.91183)"
                        />
                        <path
                            id="outline-pentagon-7"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(0.80674972,-1.5833355,1.5833355,0.80674972,102.97001,52.528782)"
                        />
                        <path
                            id="outline-pentagon-8"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.2565422,-1.2565422,1.2565422,-1.2565422,213.95036,390.23893)"
                        />
                        <path
                            id="outline-pentagon-9"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.5833355,0.80674972,-0.80674972,-1.5833355,569.72092,389.02296)"
                        />
                        <path
                            id="outline-pentagon-10"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.2565422,-1.2565422,1.2565422,-1.2565422,350.3509,291.06486)"
                        />
                        <path
                            id="outline-pentagon-11"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(1.7551409,0.27798701,-0.27798701,1.7551409,389.95349,-157.27642)"
                        />
                        <path
                            id="outline-pentagon-12"
                            class="outline-pentagon"
                            d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
                            transform="matrix(-1.7551409,-0.27798702,0.27798702,-1.7551409,392.13086,358.73531)"
                        />
                    </g>
                </svg>
            </div>
        </div>
    </div>

        <div class="details mobile">
<!--             {#if awards}
                <div class="detail">
                    <p class="section-subtitle">Awards</p>
                    <p class="detail-description">{@html awardsShort}</p>
                </div>
            {:else} -->
                <div class="detail">
                    <p class="section-subtitle">Tags</p>
                    <p class="detail-description tags">{@html tags}</p>
                </div>
            <!-- {/if} -->
        </div>
    </div>
</div>

<style>
    .hover-circle {
        width: 80%;
        height: 80%;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .details-container a {
        color: unset;
        text-decoration: none;
    }
    :global(.detail-description a) {
        color: unset;
        text-decoration: none;
        padding-bottom: 0px;
    }
    :global(.detail-description a:hover) {
        color: var(--black);
        border-bottom: 1px solid var(--black);
    }
    h2 {
        padding-bottom: 3px;
        width: fit-content;
        color: var(--color-2);
        font-family: "Vollkorn";
        font-size: 16px;
    }
    .unraveled-container {
        width: 100%;
        height: 70px;
        object-fit: contain;
    }
    .pentagon {
        opacity: 1;
        fill-opacity: 0;
        fill: #C2BBAC;
        transition: all 150ms ease-in;
    }
    .pentagon:first-child {
        fill-opacity: 1;
    }
    .outline-pentagon {
        opacity: 1;
        fill-opacity: 0;
        fill: none;
        stroke: #A29B90;
        stroke-width: 1.5;
        stroke-linecap: butt;
        stroke-linejoin: miter;
        stroke-dasharray: none;
        stroke-opacity: 1;
    }
    #pentagon-route {
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        transition: stroke-dashoffset 20ms linear;
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
    }
    #eraser-route {
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        transition: stroke-dashoffset 100ms linear;
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
    }
    .platonic-gallery {
        display: flex;
        justify-content: center;
        width: min(100%, 1200px);
        margin: 10px
    }
    .background {
        width: 100%;
        position: sticky;
        top: 0px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding-top: 50px;
        height: calc(100vh - 50px); 
    }
    .details {
        margin-top: 50px;
    }
    .details-container {
        width: 375px;
        display: flex;
        flex-direction: column;
        margin: auto 0;
    }
    .canvas-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 0;
        position: relative;
    }
    .counter {
        position: absolute;
        right: 10px;
        top: 0;
        font-size: 16px;
        font-family: var(--serif);
        color: var(--color-3);
    }
    .canvas {
        width: calc(min(80vh, 85vw) - 100px);
        position: relative;
    }
    .platonic-gallery canvas {
        width: 100% !important;
        height: unset !important;
        max-width: 100%;
    }
    .title, .description, .details {
        margin: 5px 40px 0px 0px;
        font-family: var(--serif);
        color: var(--color-1);
    }
    .title {
        margin-top: 0px;
        position: relative;
        padding-bottom: 5px;
    }
    .title-text {
        border-bottom: 1px solid var(--color-2);
    }
    .external-link {
        display: inline-block;
        height: 13px;
        width: 13px;
        position: absolute;
        top: -5px;
        padding-left: 5px;
        color: var(--color-2);
    }
    .title:hover {
         cursor: pointer;
    }
    .title:hover .title-text {
        border-bottom: 2px solid var(--black);
        color: var(--black);
    }
    .title:hover .external-link {
        color: var(--black);
    }
    .description {
        font-size: 18px;
    }
    .details {
        font-size: 16px;
        margin-bottom: 15px;
    }
    .detail-description {
        margin: 0px;
        padding-bottom: 5px;
    }
    .detail {
        margin-bottom: 30px;
    }
    .section-subtitle {
        margin-bottom: 0px;
        border-bottom: none;
        margin-top:  30px;
    }
    .title {
        font-size: 28px;
        font-family: var(--serif);
    }
    .mobile {
        display: none;
    }
    @media screen and (max-width: 1000px) {
        .mobile {
            display: block;
        }
        :global(.detail-description a) {
            border-bottom: 1px solid var(--color-2);
        }
        .counter { 
            display: none;
        }
        .background {
            flex-direction: column;
            padding-top: 50px;
            height: calc(100vh - 50px); 
            justify-content: center;
            width: min(95vw, 500px);
        }
        .details-container {
            width: 480px;
            min-height: 110px;
            margin: 0;
            margin-bottom: 15px;
        }
        .canvas-container {
            width: min(60vh, 90vw, 500px);
            height: min(60vh, 90vw, 500px);
            margin: 0 auto;
            padding: 0 0 10px 0;
        }
        .canvas {
            height: calc(100% - 70px);
            width: unset;
            margin: 0px auto;
            max-width: 100%;
        }
        .platonic-gallery {
            margin: 0 auto;
        }
        .platonic-gallery canvas {
            height: 100% !important;
            width: unset !important;
        }
        .detail-description {
            margin: 5px 0;
            max-width: 350px;
        }
        .section-subtitle {
            margin: 0px auto;
            padding-right: 0px;
            padding-bottom: 1px;
        }
        .details {
            min-height: 105px;
            margin: 0 auto;
        }
        .detail {
            padding-bottom: 10px;
            margin-bottom: 0px;
        }
        .title {
            text-align: left;
            margin: 5px 0 0 0;
        }
        .description, .details {
            text-align: left;
            margin: 5px 0 0 0;
        }
        .unraveled-container {
            height: 50px;
            margin-top: 15px;
        }
        .detail-description, .section-subtitle, .title, .description, h2 {
            margin-left: 10px;
            margin-right: 10px;
        }
    }

    @media screen and (max-width: 700px) {
        .detail {
            margin-bottom: 0px;
        }
        h2 {
            font-size: 13px;
        }
    }
    @media screen and (max-width: 500px) {
        .detail-description {
            margin-top: 3px;
            max-width: 80vw;
            line-height: 1.8;
        }
        .title {
            font-size: 24px;
        }
        .tags {
            line-height: unset !important;
        }
        .description, .details {
            font-size: 16px;
        }
        .details-container {
            width: min(100%, 350px);
        }
        .detail {
            margin-bottom: 0px;
        }
        .unraveled-container {
            height: 50px;
            margin-top: 0px;
            padding-bottom: 20px;
        }
        .section-subtitle {
            font-size: 14px;
        }
    }
    @media screen and (max-width: 375px) {
        .canvas {
            padding-top: 5px;
        }
        .detail {
            margin-bottom: 0px;
        }
        
    }
</style>
