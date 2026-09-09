//	Block, structure and roof definitions.
//	Ported from com.wasabi.benevolence.gameObjects.Block
var Block = {
	BLOCK_BROWN: 0,
	BLOCK_DIRT: 1,
	BLOCK_GRASS: 2,
	BLOCK_PLAIN: 3,
	BLOCK_STONE: 4,
	BLOCK_WATER: 5,
	BLOCK_WOOD: 6,

	MAX_BLOCK_ID: 6,

	STRUCTURE_NOTHING: 0,
	STRUCTURE_WALL: 1,
	STRUCTURE_DOOR: 2,
	STRUCTURE_WINDOW: 3,
	STRUCTURE_BUSH: 4,
	STRUCTURE_TREE: 5,
	STRUCTURE_ROCK: 6,
	STRUCTURE_STONEWALL_SHORT: 7,
	STRUCTURE_STONEWALL_TALL: 8,
	STRUCTURE_UGLY_BUSH: 9,

	MAX_STRUCTURE_ID: 9,

	ROOF_NOTHING: 0,
	ROOF_FLAT: 9,

	MAX_ROOF_ID: 9,

	ImageHeight: 171,
	ImageWidth: 101,

	BlockHeight: 81,
	BlockWidth: 101,

	BlockTopHeight: 40,
	BlockTopWidth: 101,

	BlockRoofHeight: 85,

	//	Image keys into Assets.images, indexed by type id
	BLOCK_IMAGES: [
		'Brown Block',
		'Dirt Block',
		'Grass Block',
		'Plain Block',
		'Stone Block',
		'Water Block',
		'Wood Block'
	],

	BLOCK_COLOR: [
		'#7F5E41',	// brown
		'#C18F48',	// dirt
		'#5FC148',	// grass
		'#DADAD0',	// plain
		'#7A7A7A',	// stone
		'#4C69F2',	// water
		'#ED560B'	// wood
	],

	STRUCTURE_IMAGES: [
		null,
		'Wall Block Tall',
		'Door Tall Closed',
		'Window Tall',
		'Tree Short',
		'Tree Tall',
		'Rock',
		'Stone Block',
		'Stone Block Tall',
		'Tree Ugly'
	],

	ROOF_IMAGES: [
		null,
		'Roof North',
		'Roof South',
		'Roof East',
		'Roof West',
		'Roof North East',
		'Roof North West',
		'Roof South East',
		'Roof South West',
		'Brown Block'	// flat roof
	],

	getBlockImage: function (type) { return Assets.images[Block.BLOCK_IMAGES[type]]; },
	getStructureImage: function (type) { return Assets.images[Block.STRUCTURE_IMAGES[type]]; },
	getRoofImage: function (type) { return Assets.images[Block.ROOF_IMAGES[type]]; }
};
