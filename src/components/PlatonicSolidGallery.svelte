<script defer>
    import { section } from "../store.js"
    import { onMount } from "svelte";

    import * as THREE from 'three';
    // TODO: generalize to have this extend a platonic solid gallery component
    export let platonicSolid = "dodecahedron"
    export let filename = "./assets/dodecahedron.json";
    export let scrollY = 0;

    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';    


    let numberOfSides = getNumberOfSides(platonicSolid)
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
    let year;
    let awards;
    let tags;
    let gallery;
    let foreground;
    let edges;
    let prevIndex = 0;
    let index = 0;
    let manifoldFaces = [];

    const loader = new GLTFLoader();

    let path;
    let pathLength;
    let dashArray;

    let eraserPath;

    const setPathLength = () => {
        pathLength = path.getTotalLength();
        dashArray = [pathLength, pathLength];
    };

    onMount(() => {
        manifoldFaces = [...document.querySelectorAll(".pentagon")];
    });

    function calculateScrollPercentage(element, scrollY, offset=0) {
      const elementOffsetTop = -1 * element.getBoundingClientRect().top;
      const elementHeight = element.clientHeight;
      const windowHeight = window.outerHeight;
      const offsetHeight = elementHeight * offset;
      let scrollPercentage = clamp((elementOffsetTop - offsetHeight) / (elementHeight - windowHeight), 0, 1);
      return scrollPercentage
    }

    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }


    const piecewisePoints = [0, 0.047, 0.145, 0.238, 0.326, 0.415, 0.502, 0.593, 0.687, 0.776, 0.871, 0.958, 1]
    const lerpPoints = [0, 0.083, 0.167,0.25, 0.333, 0.417, 0.5, 0.583, 0.667, 0.75, 0.833, 0.917, 1]

    let scrollProgress = 0;
    let piecewiseProgress = 0;
    $: if(foreground) {
        scrollProgress = calculateScrollPercentage(foreground, scrollY)
        piecewiseProgress = clamp(piecewisePoints[index] + (scrollProgress - lerpPoints[index]) / (lerpPoints[index + 1] - lerpPoints[index]) * (piecewisePoints[index + 1] - piecewisePoints[index]), 0, 1)

    }
    $: if (path) {
        path.style.strokeDashoffset = 1 - piecewiseProgress;
        eraserPath.style.strokeDashoffset = 1 - (piecewiseProgress - 0.083);
    }

function equals( v1, v2, epsilon = Number.EPSILON ) {
    return ( ( Math.abs( v1.x - v2.x ) < epsilon ) && ( Math.abs( v1.y - v2.y ) < epsilon ) && ( Math.abs( v1.z - v2.z ) < epsilon ) );
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

let data = [
  {
    "title": "<b>NBA:</b> Recordigami",
    "description": "Pioneering wins and losses through the history of the NBA’s regular season",
    "year": "2022",
    "awards": ["Pudding Cup Honorary Mention"],
    "tags": ["d3", "basketball", "triangle"]
  },
  {
    "title": "<b>Puerto Rico:</b> Migration",
    "description": "A pre-pandemic breakdown of Puerto Ricans in the diaspora who were returning to the island",
    "year": "2021",
    "awards": ["Award 1", "Award 2"],
    "tags": ["d3", "Puerto Rico", "Census", "choropleth", "small multiples"]
  },
  {
    "title": "Side 3",
    "description": "Description of Side 3",
    "year": "2023",
    "awards": [],
    "tags": ["Tag 3", "Tag 4", "Tag 5"]
  },
  {
    "title": "Side 4",
    "description": "Description of Side 4",
    "year": "2021",
    "awards": ["Award 3"],
    "tags": ["Tag 4", "Tag 5", "Tag 6"]
  },
  {
    "title": "Side 5",
    "description": "Description of Side 5",
    "year": "2022",
    "awards": ["Award 1", "Award 2", "Award 3"],
    "tags": ["Tag 5", "Tag 6", "Tag 7"]
  },
  {
    "title": "Side 6",
    "description": "Description of Side 6",
    "year": "2023",
    "awards": [],
    "tags": ["Tag 6", "Tag 7", "Tag 8"]
  },
  {
    "title": "Side 7",
    "description": "Description of Side 7",
    "year": "2021",
    "awards": ["Award 2", "Award 3"],
    "tags": ["Tag 7", "Tag 8", "Tag 9"]
  },
  {
    "title": "Side 8",
    "description": "Description of Side 8",
    "year": "2022",
    "awards": ["Award 1"],
    "tags": ["Tag 8", "Tag 9", "Tag 10"]
  },
  {
    "title": "Side 9",
    "description": "Description of Side 9",
    "year": "2023",
    "awards": [],
    "tags": ["Tag 9", "Tag 10", "Tag 11"]
  },
  {
    "title": "Side 10",
    "description": "Description of Side 10",
    "year": "2021",
    "awards": ["Award 3"],
    "tags": ["Tag 10", "Tag 11", "Tag 12"]
  },
  {
    "title": "Side 11",
    "description": "Description of Side 11",
    "year": "2022",
    "awards": ["Award 1", "Award 2"],
    "tags": ["Tag 11", "Tag 12", "Tag 13"]
  },
  {
    "title": "Side 12",
    "description": "Description of Side 12",
    "year": "2023",
    "awards": [],
    "tags": ["Tag 12", "Tag 13", "Tag 14"]
  }
]

title = data[0].title;
description = data[0].description;
year = data[0].year;
awards = data[0].awards.join(", ");
tags = data[0].tags.join(", ");

function createMaterial(texture, perlinTexture=null) {
    const uniforms = {
      uTexture: {
          value: texture
      },
      uTime: {
          value: .1
      },
      uRevealTexture: {
          value: perlinTexture
      },
      uRevealTextureFrequency: {
          value: new THREE.Vector2(1, 1)
      },
      uRevealRandomFrequency: {
          value: new THREE.Vector2(1, 1)
      },
      uRevealProgress: {
          value: 1
      },
      uFogColor: {
          value: new THREE.Color( "#f6f5f1" )
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
    // TODO: figure out how to get gallery height non-circularly
    const width = Math.min(.8 * window.outerHeight, .85 * window.innerWidth); // window.innerWidth / 2;
    const height =  Math.min(.8 * window.outerHeight, .85 * window.innerWidth); 
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
    renderer.setClearColor( 0xf6f5f1, 0);
    renderer.render(scene, camera);

    const color = 0xf6f5f1 // 0xFFFFFF;
    const intensity = 1;
    const ambientLight = new THREE.AmbientLight(color, intensity);

    const fogColor = 0xffffff// 0xFFFFFF;  // white
    const near = 10;
    const far = 17;
    scene.fog = new THREE.Fog(fogColor, near, far);

    scene.add(ambientLight);

    const geometry = getGeometry(platonicSolid);

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

    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    // const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa, linewidth: 2});
    const material = new THREE.LineBasicMaterial({ color: 0x999999, linewidth: 2});
    edges = new THREE.LineSegments(edgesGeometry, material);
    scene.add(edges);

    const textures = [
        new THREE.TextureLoader().load('textures/fade.png'),
        new THREE.TextureLoader().load('textures/puerto_rico_migration.png'),
        new THREE.TextureLoader().load('textures/elevation_ridgelines.png'),
        new THREE.TextureLoader().load('textures/house_of_cards.png'),
        new THREE.TextureLoader().load('textures/nba_season_paths.png'),
        new THREE.TextureLoader().load('textures/linguistics.png'),
        new THREE.TextureLoader().load('textures/around_the_world.png'),
        new THREE.TextureLoader().load('textures/made_in_miami.png'),
        new THREE.TextureLoader().load('textures/wnba_season_paths.png'),
        new THREE.TextureLoader().load('textures/security_for_sale.png'),
        new THREE.TextureLoader().load('textures/nba_season_triangle.png'),
        new THREE.TextureLoader().load('textures/poem_wheel.png')
    ];

    const materials = textures.map((texture) => createMaterial(texture))
    actualGroup = new THREE.Group();

    let faces = []
    loader.load( 'models/dodecahedron.glb', function ( gltf ) {
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
    }, undefined, function ( error ) {
        console.error( error );
    });

    drawn = true;
}

function updateGallery() {
    if ($section === 1 && actualGroup.children.length) {
        const itemHeight = window.outerHeight / 1.2;
        index = gallery ? Math.floor((scrollY - gallery?.parentElement?.offsetTop) / itemHeight) : 0;
        index = clamp(index, 0, numberOfSides - 1)

        actualGroup.children.filter((child,i) => i != index).forEach((child) => {
            if (child.material.uniforms.uProgress.value > 0) {
                child.material.uniforms.uProgress.value += (0 - child.material.uniforms.uProgress.value) * 0.05;
            }
        })

        if (index !== prevIndex) {
            const indexData = data[index];
            if (indexData) {
                title = indexData.title;
                description = indexData.description;
                year = indexData.year;
                awards = indexData.awards.join(", ");
                tags = indexData.tags.join(", ");

                // TODO - replace query selector by array
                if (index > prevIndex){
                    manifoldFaces.filter((item, i) => i < index).forEach((item) => {
                        item.style.fillOpacity = 0
                    })
                } else {
                    manifoldFaces.filter((item, i) => i > index).forEach((item) => {
                        item.style.fillOpacity = 0
                    })
                }
                manifoldFaces[index].style.opacity = 1
                manifoldFaces[index].style.fillOpacity = 1

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
        renderer.render(scene, camera);
    }
    window.requestAnimationFrame(updateGallery);
};

$: !drawn && canvas && drawPlatonicSolid(platonicSolid);

window.requestAnimationFrame(() => { updateGallery() })

$: windowHeight = window.outerHeight;
$: galleryHeight = windowHeight * numberOfSides / 1.2 + windowHeight;
    
    let innerWidth = window.innerWidth

    $: isMobile = innerWidth < 1000;

</script>

<svelte:window bind:innerWidth={innerWidth}/>

<div class="platonic-gallery" bind:this={gallery}>
    <div class="foreground" style={`height: ${galleryHeight}px`} bind:this={foreground}></div>

    <div class="background" style="height: calc(100vh - 75px);">

        <div class="details-container">
            <div class="title">{@html title}</div>
            <div class="description">{description}</div>
            {#if !isMobile}
                <div class="details">
                    {#if awards}
                        <div class="detail">
                            <p class="section-subtitle">Awards</p>
                            <p class="detail-description">{awards}</p>
                        </div>
                    {/if}
                    <div class="detail">
                        <p class="section-subtitle">Tags</p>
                        <p class="detail-description">{tags}</p>
                    </div>
                    <!-- <div class="detail">
                        <p class="section-subtitle">Year</p>
                        <p class="detail-description">{year}</p>
                    </div> -->
                </div>
            {/if}
        </div>

        <div style="display: flex; flex-direction: column; justify-content: center; min-height: 0;">
            <div class="canvas"> 
                <canvas height="800" width="800" bind:this={canvas}></canvas>
            </div>
            <div>
            <div class="manifold-container">
                <svg
   width="100%"
   height="100%"
   viewBox="0 0 527.96284 261.57872"
   version="1.1"
   id="svg5"
   xml:space="preserve"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><defs
     id="defs2" /><g
     id="layer1"
     transform="translate(-0.30301638,-0.43095359)">

     <path
       id="pentagon-1"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.7551409,0.27798701,-0.27798701,1.7551409,136.43801,-96.294659)" /><path
       id="pentagon-2"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.7551409,-0.27798702,0.27798702,-1.7551409,138.61539,419.71701)" /><path
       id="pentagon-3"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.2565422,1.2565422,-1.2565422,1.2565422,178.218,-28.624215)" /><path
       id="pentagon-4"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.5833355,-0.80674972,0.80674972,1.5833355,-41.15203,-126.58232)" /><path
       id="pentagon-5"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.2565422,1.2565422,-1.2565422,1.2565422,314.61852,-127.79833)" /><path
       id="pentagon-6"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-0.80674972,1.5833355,-1.5833355,-0.80674972,425.59887,209.91183)" /><path
       id="pentagon-7"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(0.80674972,-1.5833355,1.5833355,0.80674972,102.97001,52.528782)" /><path
       id="pentagon-8"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.2565422,-1.2565422,1.2565422,-1.2565422,213.95036,390.23893)" /><path
       id="pentagon-9"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.5833355,0.80674972,-0.80674972,-1.5833355,569.72092,389.02296)" /><path
       id="pentagon-10"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.2565422,-1.2565422,1.2565422,-1.2565422,350.3509,291.06486)" /><path
       id="pentagon-11"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.7551409,0.27798701,-0.27798701,1.7551409,389.95349,-157.27642)" /><path
       id="pentagon-12"
       class="pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.7551409,-0.27798702,0.27798702,-1.7551409,392.13086,358.73531)" />

           <path
                bind:this={path}
                on:resize={setPathLength}
                id="pentagon-route"
                pathLength="1"
                stroke-width="2"
                stroke="gray"
                fill="none" 
                d="m 137.52669,112.07243 2e-5,99.27748 -84.041698,-61.10194 31.857468,-99.237934 104.54305,0.06382 32.1296,99.174094 84.5386,-38.05529 32.1296,99.17408 104.54307,0.0639 31.85747,-99.23793 -84.04169,-61.101995 v 99.277535"
            />
          <path
                bind:this={eraserPath}
                on:resize={setPathLength}
                id="eraser-route"
                pathLength="1"
                stroke-width="6"
                stroke="#f6f5f1"
                fill="none" 
                d="m 137.52669,112.07243 2e-5,99.27748 -84.041698,-61.10194 31.857468,-99.237934 104.54305,0.06382 32.1296,99.174094 84.5386,-38.05529 32.1296,99.17408 104.54307,0.0639 31.85747,-99.23793 -84.04169,-61.101995 v 99.277535"
            />


  <path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-1"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.7551409,0.27798701,-0.27798701,1.7551409,136.43801,-96.294659)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-2"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.7551409,-0.27798702,0.27798702,-1.7551409,138.61539,419.71701)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-3"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.2565422,1.2565422,-1.2565422,1.2565422,178.218,-28.624215)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-4"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.5833355,-0.80674972,0.80674972,1.5833355,-41.15203,-126.58232)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-5"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.2565422,1.2565422,-1.2565422,1.2565422,314.61852,-127.79833)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-6"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-0.80674972,1.5833355,-1.5833355,-0.80674972,425.59887,209.91183)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-7"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(0.80674972,-1.5833355,1.5833355,0.80674972,102.97001,52.528782)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-8"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.2565422,-1.2565422,1.2565422,-1.2565422,213.95036,390.23893)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-9"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.5833355,0.80674972,-0.80674972,-1.5833355,569.72092,389.02296)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-10"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.2565422,-1.2565422,1.2565422,-1.2565422,350.3509,291.06486)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-11"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(1.7551409,0.27798701,-0.27798701,1.7551409,389.95349,-157.27642)" /><path
       style="stroke:#AAAAAA;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
       id="outline-pentagon-12"
       class="outline-pentagon"
       d="m 41.231933,140.49878 -17.912028,2.821 -17.9070843,2.85219 -8.2180441,-16.16361 -8.2461946,-16.14927 12.8329968,-12.81066 12.8106562,-12.832997 16.149272,8.246195 16.163615,8.218042 -2.852197,17.90709 z"
       transform="matrix(-1.7551409,-0.27798702,0.27798702,-1.7551409,392.13086,358.73531)" />


        </g>
    </svg>
            </div>
<!-- 
                <img src="/images/dodecahedron_manifold.svg" style="width: 100%; margin:  10px 0; height: 70px; object-fit: contain;"> -->
            </div>
        </div>

        {#if isMobile}
            <div class="details">
                    {#if awards}
                        <div class="detail">
                            <p class="section-subtitle">Awards</p>
                            <p class="detail-description">{awards}</p>
                        </div>
                    {/if}
                    <div class="detail">
                        <p class="section-subtitle">Tags</p>
                        <p class="detail-description">{tags}</p>
                    </div>
                    <!-- <div class="detail">
                        <p class="section-subtitle">Year</p>
                        <p class="detail-description">{year}</p>
                    </div> -->
                </div>
        {/if}
    </div>
</div>

<style>
    .manifold-container {
        width: 100%;
        margin: 10px 0;
        height: 70px;
        object-fit: contain;
    }
    .pentagon {
        opacity: 1;
        fill-opacity: 0;
        fill: #E2E1DD;
        transition: all 150ms ease-in;
    }
    .outline-pentagon {
        opacity: 1;
        fill-opacity: 0;
        fill: none;
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
        width: min(90vw, 1000px);
        margin: 0 auto;
    }
    .background {
        width: 100%;
        position: sticky;
        top: 0px;
        display: flex;
        flex-direction: row;
        padding-top: 75px;
        height: calc(100vh - 75px); 
    }
    .details {
        margin-top: 50px;
    }
    .details-container {
        width: 375px;
        display: flex;
        flex-direction: column;
        margin: auto;
    }
    .canvas {
        /*height: min(80vh, 85vw);*/
        width: calc(min(80vh, 85vw) - 100px);
        /*margin: auto;*/
        position: relative;
    }
    .platonic-gallery canvas {
        width: 100% !important;
        height: 100% !important;
    }
    .title, .description, .details {
        margin: 5px 40px 0px 0px;
        font-family: 'IM Fell English';
    }
    .description {
        font-size: 18px;
        color: #444;
    }
    .details {
        font-size: 16px;
        color: #444;
        margin-bottom: 15px;
    }
    .detail-description {
        margin: 0px;
    }
    .detail {
        margin-bottom: 20px;
    }
    .section-subtitle {
        margin-bottom: 0px;
        border-bottom: none;
    }
    .title {
        font-size: 28px;
        font-family: 'IM Fell English';
    }
    @media screen and (max-width: 992px) {
        .background {
            flex-direction: column;
            padding-top: 50px;
            height: calc(100vh - 50px); 
            justify-content: center;
        }
        .details-container {
            width: min(100%, 400px);
            height: 100px;
            margin: 0 auto;
        }
        .canvas {
            height: min(80vh, 70vw, 400px);
            width: min(80vh, 70vw, 400px);
            margin: 10px auto;
        }
        canvas {
            width: 100% !important;
            height: 100% !important;
        }
        .detail-description {
            margin: 5px;
        }
        .section-subtitle {
            margin: 0px auto;
            padding-right: 0px;
            padding-bottom: 1px;
            font-size: 11px;
        }
        .details {
            height: 105px;
            margin: 0 auto;
        }
        .detail {
            padding-bottom: 10px;
            margin-bottom: 0px;
        }
        .title {
            text-align: center;
            margin: 5px 0 0 0;
        }
        .description, .details {
            font-size: 14px;
            text-align: center;
            margin: 5px 0 0 0;
        }
        .manifold-container {
            height: 50px;
        }
    }

    @media screen and (max-width: 700px) {
        .img-container {
            max-height: min(80vh, 90vw, 350px);
            max-width: min(80vh, 90vw, 350px);
        }
        .canvas {
            height: min(80vh, 90vw, 350px);
            width: min(80vh, 90vw, 350px);
            margin: 10px auto;
        }
        .detail {
            margin-bottom: 0px;
        }
    }
    @media screen and (max-width: 500px) {
        .img-container {
            max-height: min(80vh, 80vw, 400px);
            max-width: min(80vh, 80vw, 400px);
        }
        .canvas {
            height: min(80vh, 80vw, 400px);
            width: min(80vh, 80vw, 400px);
            margin: 10px auto;
        }
        .detail {
            margin-bottom: 0px;
        }
        .manifold-container {
            height: 50px;
            margin-top: 0px;
            padding-bottom: 20px;
        }
    }
    @media screen and (max-width: 375px) {
        .img-container {
            max-height: min(80vh, 90vw, 280px);
            max-width: min(80vh, 90vw, 280px);
        }
        .canvas {
            padding-top: 5px;
            height: min(80vh, 90vw, 280px);
            width: min(80vh, 90vw, 280px);
            margin: 10px auto;
        }
        .detail {
            margin-bottom: 0px;
        }
        
    }
</style>
