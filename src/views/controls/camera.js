
function CameraControls(camera, container)
{
	this.SPEED = {
		movement: 5.0,  // units/second
		rotation: 0.003,  // radians/pixel
	};

	this.camera = camera;
	this.unlocked = false;
	this.keys = {};

	container.on('mousedown', this.onMouseDown.bind(this));
	$(window).on('mouseup', this.onMouseUp.bind(this));
	$(window).on('mousemove', this.onMouseMove.bind(this));
	container.on('keydown', this.onKeyDown.bind(this));
	container.on('keyup', this.onKeyUp.bind(this));
}

CameraControls.prototype.update = function(dt)
{
	if (this.unlocked) {
		let dist = this.SPEED.movement * dt;
		let axis = new THREE.Vector3();

		if (this.keys[Keys.CTRL]) {
			dist *= 0.3;
		}
		if (this.keys[Keys.SHIFT]) {
			dist *= 3;
		}
		if (this.keys[Keys.W]) {
			axis.z -= 1;
		}
		if (this.keys[Keys.S]) {
			axis.z += 1;
		}
		if (this.keys[Keys.A]) {
			axis.x -= 1;
		}
		if (this.keys[Keys.D]) {
			axis.x += 1;
		}
		if (this.keys[Keys.Q]) {
			axis.y -= 1;
		}
		if (this.keys[Keys.E]) {
			axis.y += 1;
		}
		this.camera.translateOnAxis(axis.normalize(), dist);
	}
}

CameraControls.prototype.onMouseDown = function(event)
{
	if (event.which == Mouse.RIGHT) {
		this.unlocked = true;
	}
}

CameraControls.prototype.onMouseMove = function(event)
{
	if (this.unlocked && this.prev_pos) {
		let dh = event.clientX - this.prev_pos.x;
		let dv = event.clientY - this.prev_pos.y;
		this.camera.rotation.y -= this.SPEED.rotation * dh;
		this.camera.rotation.x -= this.SPEED.rotation * dv;
		this.camera.rotation.x = THREE.Math.clamp(this.camera.rotation.x, -1.5, 1.5);
	}
	this.prev_pos = {x: event.clientX, y: event.clientY};
}

CameraControls.prototype.onMouseUp = function(event)
{
	if (event.which == Mouse.RIGHT) {
		this.unlocked = false;
	}
}

CameraControls.prototype.onKeyDown = function(event)
{
	this.keys[event.keyCode] = true;
}

CameraControls.prototype.onKeyUp = function(event)
{
	this.keys[event.keyCode] = false;
}
