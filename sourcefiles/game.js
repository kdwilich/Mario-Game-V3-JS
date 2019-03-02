class Sprite
{
	constructor(model, x, y, image_url, update_method, onclick_method)
	{
		this.model = model;
		this.x = x;
		this.y = y;
		this.image = new Image();
		this.image.src = image_url;
		this.update = update_method;
		this.onclick = onclick_method;
		this.w;
		this.h;
		this.vertvel;
		this.horizvel;
		this.num_hits = 0;
	}

	update()
	{

	}


	set_destination(x, y)
	{
		this.dest_x = x;
		this.dest_y = y;
	}

	ignore_click(x, y)
	{
	}

	move(dx, dy)
	{
		this.dest_x = this.x + dx;
		this.dest_y = this.y + dy;
	}


	go_toward_destination()
	{
	}

	sit_still()
	{
	}

	is_brick()
	{
		return false;
	}

	is_mario()
	{
		return false;
	}

	is_coinblock()
	{
		return false;
	}
}

class Mario extends Sprite
{
	constructor(model, x, y, image_url, update_method, onclick_method)
	{
		super(model, x, y, image_url, update_method, onclick_method);
		this.w = 60;
		this.h = 95;
		this.mvmnt = 15;
		this.gravity = 6;
		this.vertvel = 4;
		this.prev_x = 0;
		this.prev_y = 0;
		this.grounded = false;
		this.collides_on_bottom = false;
		this.num_hits = 0;
	}

	set_destination(x, y)
	{
		this.dest_x = x;
		this.dest_y = y;
	}

	ignore_click(x, y)
	{
	}

	move(dx, dy)
	{
		this.dest_x = this.x + dx;
		this.dest_y = this.y + dy;
	}

	//set marios previous location to keep him out of the object he collides with
	rememberPrevStep()
	{
		this.prev_x = this.x;
		this.prev_y = this.y;
	}

	sit_still()
	{
		this.y+=this.gravity*3;

		if(this.y >= 500)	{
			this.y = 500;
			this.update = Sprite.prototype.go_toward_destination;
		}
	}

	//return false if mario is not colliding with anything and true if he is
	doesCollide(x, y, w, h)
	{
		if(this.x + this.w <= x) // my right in your left
			return false;
		else if(this.x >= x + w) // my left in your right
			return false;
		else if(this.y + this.h <= y) // my bottom in your top
			return false;
		else if(this.y >= y + h) // my top in your bottom
			return false;
		else
			return true;
	}

	//push mario out of whatever object's coordinates were passed
	getOut(x, y, w, h)
	{
		if(this.x + this.w > x && this.prev_x + this.w <= x) // collides with left
		{
			this.x = x - this.w;
		}
	 	else if(this.x < x + w && this.prev_x >= w + x) // collides with right
		{
			this.x = x + w;
		}
		else if(this.y + this.h > y && this.prev_y + this.h <= y) // collides with top
		{
			this.y = y - this.h;
			this.vertvel = 0;
			this.grounded = true;
		}
		else if(this.y < y + h )//&& this.prev_y <= y + h) // collides with bottom
		{
			this.collides_on_bottom = true;
			this.y = y + h;
			this.vertvel = 0;
		}
	}

	is_mario()
	{
		return true;
	}

	update()
	{
		if(this.x > 250)
			this.model.scrollpos = this.x - 250;
		if(this.x <= 0)
			this.x = 0;

		this.vertvel += this.gravity;
		this.y += this.vertvel;

		if(this.y >= 500)	{
			this.y = 500;
			this.vertvel = 0;
			this.grounded = true;
		}
		else {
			this.grounded = false;
		}

		for(let i = 0; i < this.model.sprites.length; i++)
		{
			let s = this.model.sprites[i];
			if(s.is_brick())
			{
				if(this.doesCollide(s.x, s.y, s.w, s.h))
				{
					this.getOut(s.x, s.y, s.w, s.h);
				}
			}

		 	if(s.is_coinblock())
			{
				if(this.doesCollide(s.x, s.y, s.w, s.h))
				{
					this.getOut(s.x, s.y, s.w, s.h);
					if(this.collides_on_bottom)
					{
						console.log(this.collides_on_bottom);
						s.num_hits++;
						if(s.num_hits <= 5) {
							s.pop_out(this.model, s.x, s.y);
							console.log(this.num_hits);

							//let cb = new CoinBlock(this.model, s.x, s.y, s.image_url, s.update_method, s.onclick_method);
							//cb.pop_out(cb.model, cb.x, cb.y);
						}
						this.collides_on_bottom = false;
					}
				}
			}
		}
	}

}


class Brick extends Sprite
{
	constructor(model, x, y, w, h, image_url, update_method, onclick_method)
	{
		super(model, x, y, image_url, update_method, onclick_method)
		this.w = w;
		this.h = h;
	}

	update()
	{
		return true;
	}

	is_brick()
	{
		return true;
	}
}

class CoinBlock extends Sprite
{
	constructor(model, x, y, image_url, update_method, onclick_method)
	{
		super(model, x, y, image_url, update_method, onclick_method);
		this.w = 75;
		this.h = 75;
	}

	update()
	{
		return true;
	}

	pop_out(model, x, y)
	{
		this.horizvel = Math.random() * 16 - 8;
		this.vertvel = -20;

		this.c = new Coin(model, x, y, this.vertvel, this.horizvel, "sourcefiles/images/coin.png", Coin.prototype.update, Coin.prototype.set_destination);
		this.model.sprites.push(this.c);
	}

	is_coinblock()
	{
		return true;
	}
}

class Coin extends Sprite
{
	constructor(model, x, y, vv, hv,image_url, update_method, onclick_method)
	{
		super(model, x, y, image_url, update_method, onclick_method);
		this.x = x + 15;
		this.y = y - 25;
		this.w = 60;
		this.h = 60;
		this.vertvel = vv;
		this.horizvel = hv;
	}

	update()
	{
		this.x += this.horizvel;
		this.vertvel += 3.5;
		this.y += this.vertvel;

		if(this.y > 560)
			return false;

		return true;
	}


}


class Model
{
	constructor()
	{
		//create sprite array
		this.sprites = [];

		//create a new mario and add to sprite array
		this.mario = new Mario(this, 250, 0, "sourcefiles/images/mario1.png", Mario.prototype.update, Mario.prototype.set_destination);
		this.sprites.push(this.mario);

		//keep track of the scroll position of the screen
		this.scrollpos  = 0;

		//load the JSON file into the map variable as a string
		var map = '{"sprites":['+
	  '{"type":"Mario","x":150,"y":500,"w":65,"h":90,"vertvel":0.0},'+
  	'{"type":"Brick","x":345,"y":495,"w":369,"h":44},'+
  	'{"type":"CoinBlock","x":501,"y":295,"w":75,"h":75},'+
  	'{"type":"Brick","x":710,"y":355,"w":155,"h":240},'+
  	'{"type":"Brick","x":846,"y":397,"w":258,"h":74},'+
  	'{"type":"Brick","x":1308,"y":346,"w":120,"h":70},'+
  	'{"type":"CoinBlock","x":1328,"y":146,"w":75,"h":75},'+
	  '{"type":"Brick","x":1631,"y":463,"w":160,"h":89},'+
  	'{"type":"Brick","x":1891,"y":356,"w":130,"h":239},'+
	  '{"type":"Brick","x":2100,"y":295,"w":250,"h":78},'+
  	'{"type":"CoinBlock","x":2300,"y":95,"w":75,"h":75}]}';

		//turn the string map into a parsed JSON object called map_parse
		this.map_parse = JSON.parse(map);

	}

	//update all sprites
	update()
	{

		for(let i = 0; i < this.sprites.length; i++)
		{
			this.sprites[i].update();
		}


	}

	//remember marios previous step
	rememberPrevStep()
	{
		this.mario.rememberPrevStep();
	}

	onclick(x, y)
	{
		for(let i = 0; i < this.sprites.length; i++)
		{
			this.sprites[i].onclick(x, y);
		}
	}

	move(dx, dy)
	{
		this.mario.move(dx, dy);
	}

	//unload the JSON map file
	unmarshall()
	{
		for(let i = 0; i < this.sprites.length; i++)
		{
			this.sprites.pop();
		}

		var JSONsprites = this.map_parse.sprites;
		for(let i = 0; i < this.map_parse.sprites.length; i++){
			if(JSONsprites[i].type == "Brick") {
				this.sprites.push(new Brick(this, JSONsprites[i].x, JSONsprites[i].y, JSONsprites[i].w, JSONsprites[i].h,
					"sourcefiles/images/brick1.png", Brick.prototype.update, Brick.prototype.set_destination));
			}

			else if(JSONsprites[i].type == "CoinBlock") {
				this.sprites.push(new CoinBlock(this, JSONsprites[i].x, JSONsprites[i].y,
					"sourcefiles/images/blockUnhit.png", CoinBlock.prototype.update, CoinBlock.prototype.set_destination));
			}

			else {
				this.mario = new Mario(this, JSONsprites[0].x, JSONsprites[0].y,
					"sourcefiles/images/mario1.png", Mario.prototype.update, Mario.prototype.set_destination);

				this.sprites.push(this.mario);
			}
		}
	}
}




class View
{
	constructor(model)
	{
		this.model = model;
		this.canvas = document.getElementById("myCanvas");

		//initialize mario image
		this.mario_images = new Array();

		this.mario_images[0] = new Image();
		this.mario_images[0].src = "sourcefiles/images/mario1.png";

		this.mario_images[1] = new Image();
		this.mario_images[1].src = "sourcefiles/images/mario2.png";

		this.mario_images[2] = new Image();
		this.mario_images[2].src = "sourcefiles/images/mario3.png";

		this.mario_images[3] = new Image();
		this.mario_images[3].src = "sourcefiles/images/mario4.png";

		this.mario_images[4] = new Image();
		this.mario_images[4].src = "sourcefiles/images/mario5.png";

		//initialize background image
		this.background = new Image();
		this.background.src = "sourcefiles/images/bgClouds.png";



	}

	update()
	{
		let ctx = this.canvas.getContext("2d");

		//clear screen
		ctx.clearRect(0, 0, 900, 700);

		//draw background
		ctx.drawImage(this.background, -150 - this.model.scrollpos, 0);
		ctx.drawImage(this.background, -150 - this.model.scrollpos + 1920, 0);

		//draw ground
		ctx.fillStyle = 'brown';
		ctx.fillRect(0,595,900,700);

		//draw sprites
		for(let i = 0; i < this.model.sprites.length; i++)
		{
			let sprite = this.model.sprites[i];
			if(this.model.sprites[i].is_mario())
			{
				let marioFrame = (Math.abs(sprite.x) / 20) % 5; //20 = rate of running, 5 = frames of mario
				sprite.image = this.mario_images[parseInt(marioFrame)];
			}
			if(this.model.sprites[i].is_coinblock())
			{
				if(this.model.sprites[i].num_hits > 4)
				{
					sprite.image.src = "sourcefiles/images/blockHit.png";
				}
			}
			ctx.drawImage(sprite.image, sprite.x - this.model.scrollpos, sprite.y, sprite.w, sprite.h);
		}
	}
}




class Controller
{
	constructor(model, view)
	{
		this.model = model;
		this.view = view;
		this.key_right = false;
		this.key_left = false;
		this.key_space = false;
		let self = this;
		view.canvas.addEventListener("click", function(event) { self.onClick(event); });
		document.addEventListener('keydown', function(event) { self.keyDown(event); }, false);
		document.addEventListener('keyup', function(event) { self.keyUp(event); }, false);
	}

	onClick(event)
	{
		this.model.onclick(event.pageX - this.view.canvas.offsetLeft, event.pageY - this.view.canvas.offsetTop);
	}

	keyDown(event)
	{
		if(event.keyCode == 39) this.key_right = true;
		else if(event.keyCode == 37) this.key_left = true;
		else if(event.keyCode == 32 && this.model.mario.grounded) this.key_space = true;
	}

	keyUp(event)
	{
		if(event.keyCode == 39) this.key_right = false;
		else if(event.keyCode == 37) this.key_left = false;
		else if(event.keyCode == 32) this.key_space = false;
	}

	update()
	{
		this.model.rememberPrevStep();

		if(this.key_right) this.model.mario.x+=this.model.mario.mvmnt;
		if(this.key_left) this.model.mario.x-=this.model.mario.mvmnt;
		if(this.key_space) {
				this.model.mario.vertvel -= 45;
				this.model.mario.grounded = false;
				this.key_space = false;
		}

	}
}





class Game
{
	constructor()
	{
		this.model = new Model();
		this.view = new View(this.model);
		this.controller = new Controller(this.model, this.view);

		this.model.unmarshall();
	}

	onTimer()
	{
		this.controller.update();
		this.model.update();
		this.view.update();
	}
}


let game = new Game();
let timer = setInterval(function() { game.onTimer(); }, 40);
