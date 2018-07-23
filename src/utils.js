
let Keys = {SHIFT: 16, CTRL: 17, ALT: 18, DEL: 46, F2: 113};
for (let c = 65; c <= 90; ++c) {
	Keys[String.fromCharCode(c)] = c;
}

Array.prototype.extend = function(arr)
{
	arr.forEach((el) => {
		this.push(el);
	});
};

Array.prototype.remove = function(el)
{
	let index = this.indexOf(el);
	this.splice(index, 1);
};

Array.prototype.prop = function(prop)
{
	return this.map((obj) => obj[prop]);
};

String.prototype.upper = String.prototype.toUpperCase;
String.prototype.lower = String.prototype.toLowerCase;

String.prototype.capitalize = function()
{
	return this[0].upper() + this.slice(1);
};

String.prototype.format = function()
{
	let args = arguments;
	return this.replace(/{([\w.]*)}/g, function(match, pattern) {
		let attrs = pattern.split('.');
		attrs[0] = attrs[0] || '0';
		let obj = args;
		for (let i = 0, n = attrs.length; i < n; ++i) {
			obj = obj[attrs[i]];
			if (obj === undefined) {
				break;
			}
		}
		return (obj !== undefined ? obj : match);
	});
};

let _ = undefined;

Function.prototype.partial = function()
{
	let f = this;
	let org_args = [].slice.call(arguments);
	return function() {
		let args = org_args.slice();
		let new_args = [].slice.call(arguments);
		let i, j;
		for (i = 0, j = 0; i < args.length && j < new_args.length; ++i) {
			if (args[i] === _) {
				args[i] = new_args[j++];
			}
		}
		return f.apply(this, args.concat(new_args.slice(j)));
	};
};

Function.prototype.lock = function(n)
{
	let f = this;
	return function() {
		return f.apply(this, [].slice.call(arguments, 0, n));
	};
};

$.jstree.core.prototype.get_children = function(obj)
{
	return this.get_node(obj).children.map(this.get_node.lock(1), this);
};

$.jstree.core.prototype.get_parent = function(obj)
{
	return this.get_node(this.get_node(obj).parent);
};

$.jstree.core.prototype.get_siblings = function(obj)
{
	return this.get_children(this.get_parent(obj));
};

function readDirectorySync(dir_path, options, callback)
{
	let folders = [], files = [];

	fs.readdirSync(dir_path).forEach((name) => {
		let abs_path = path.join(dir_path, name);
		let stat = fs.statSync(abs_path);
		if (stat.isDirectory()) {
			folders.push(name);
		} else {
			files.push(name);
		}
	});

	callback(dir_path, folders, files);

	if (options.recursive) {
		folders.forEach((name) => {
			let abs_path = path.join(dir_path, name);
			readDirectorySync(abs_path, options, callback)
		});
	}
}
