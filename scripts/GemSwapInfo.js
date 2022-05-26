class GemSwapInfo {
    constructor(index1, index2, sizeMatch, type, modifiers)
    {
        this.index1 = index1;
        this.index2 = index2;
        this.sizeMatch = sizeMatch;
        this.type = type;
        this.modifiers = modifiers;
    }

    getIndexSwapGem() {
        return [this.index1, this.index2];
    }
}