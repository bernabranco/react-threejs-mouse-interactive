
import {useEffect} from 'react'
import * as THREE from 'three';
import Stats from './Stats.js'

export default function Shader1(){

const vertexShader = `
precision mediump float;
uniform float u_time;

void main(){
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `

	precision mediump float;
	uniform float u_time;
	uniform vec2 u_resolution;
	uniform vec2 u_mouse;

	void main() {

	vec2 st = gl_FragCoord.xy/u_resolution;

	vec2 coord;
	coord.x = 5.*st.x;
	coord.y = 5.*st.y;

	for (int i = 0; i < 3; i++) {
	coord.x +=  1.*sin(coord.y + u_time);
	coord.y +=  1.*cos(coord.x + u_time);
	}
		
	vec3 color = vec3(sin(coord.x*coord.y*0.1+u_mouse.x*0.005),sin(coord.x*coord.y*0.1+u_mouse.y*0.005),sin(coord.x*coord.y*0.1+u_mouse.y*0.003)); 
	gl_FragColor = vec4(color*0.9, 1.0);
}
`

useEffect(() => {

	let mouseX;
	let mouseY;

	// See performance stats
	(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

	// Choose shader container
	let container = document.getElementById('webgl-canvas');

	// Define shader size
	let sizes = {
		width: window.innerWidth,
		height: window.innerHeight
	}

    // Create canvas and append to DOM
	const renderer = new THREE.WebGLRenderer(); 
	renderer.setPixelRatio(window.devicePixelRatio); 	
	renderer.setSize(sizes.width, sizes.height); 
	container.appendChild(renderer.domElement); 

	// Create scene
	const scene = new THREE.Scene();
	
	// Create geometry
	const geometry = new THREE.PlaneGeometry( 2, 2, 1);

	// Create custom material
	const material = new THREE.ShaderMaterial({
		// uniforms are pass to vert and frag shader
		uniforms: {
			u_time: { value: 1.0 },
			u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
			u_mouse: {value: new THREE.Vector2(0, 0)},
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	});
	
	// Create Mesh
	const mesh = new THREE.Mesh( geometry, material );

	// Create Camera
	const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000 );

	// Add things to scene
	scene.add(mesh, camera);

	// Update values
	function render() {
		renderer.render(scene, camera);
		material.uniforms.u_time.value += 0.04;
		material.uniforms.u_mouse.value = new THREE.Vector2(mouseX,mouseY);

		requestAnimationFrame(render);
	}

	render();

	// Add mouse and size event listeners
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('mousemove', mousePosition, false);

	// Update mouse position
	function mousePosition(e){
		console.log(mouseX);
		mouseX = e.pageX;
		mouseY = e.pageY;
	}

	// Update window size
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	});

return(
		null
	)
}



