const GemType = {
    NONE: -1,
    SWORD: 0,
    GREEN: 1,
    YELLOW: 2,
    RED: 3,
    PURPLE: 4,
    BLUE: 5,
    BROWN: 6
}

const GemModifier = {
    NONE: 0,
    MANA: 1,
    HIT_POINT: 2,
    BUFF_ATTACK: 3,
    POINT: 4,
    EXTRA_TURN: 5,
    EXPLODE_HORIZONTAL: 6,
    EXPLODE_VERTICAL: 7,
    EXPLODE_SQUARE: 8
}


const GemColor = {
    '-1': 'gray',
    0: '#00000073',
    1: '#00800080',
    2: '#ffff0075',
    3: '#ff000075',
    4: '#80008080',
    5: '#0000ff75',
    6: '#78252570'
}

const HEIGHT = 8;
const WIDTH = 8;

class Gem {
    constructor(index, type, gemModifier) {
        this.signature = Math.random();
        this.index = index;
        this.type = type;

        this.modifier = gemModifier;

        this.x = -1;
        this.y = -1;

        this.updatePosition();
    }

    updatePosition() {
        this.y = parseInt(this.index / HEIGHT);
        this.x = parseInt(this.index - this.y * WIDTH);
    }

    sameType(other) {
        return this.type === other.type;
    }

    sameOne(other) {
        return this.signature == other.signature;
    }

    markAsRemoved() {
        this.removed = true;
    }

    clone() {
        const cloned = new Gem(this.index, this.type, this.modifier);
        cloned.signature = this.signature;
        return cloned;
    }
}