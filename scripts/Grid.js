function union (sets) {
    return sets.reduce((combined, list) => {
      return new Set([...combined, ...list]);
    }, new Set());
  }

class Grid {
    constructor(gemsCode, gemModifiers, gemTypes) {
        this.gems = [];
        this.gemeCode = gemsCode;
        this.gemTypes = new Set();
        this.updateGems(gemsCode, gemModifiers);

        this.myHeroGemType = gemTypes;
    }

    updateGems(gemsCode, gemModifiers) {
        this.gems = [];
        this.gemeCode = gemsCode;
        this.gemTypes = new Set();

        for (let i = 0; i < gemsCode.size(); i++) {
            let gem = new Gem(i, gemsCode.getByte(i), gemModifiers != null ? gemModifiers.getByte(i) : GemModifier.NONE);
            this.gems.push(gem);

            this.gemTypes.add(gem.type);

            // console.log(i + ": " + gem.type)
        }
    }

    recommendSwapGem() {
        let listMatchGem = this.suggestMatch();

        console.log("recommendSwapGem: ", listMatchGem);

        if (listMatchGem.length === 0) {
            return [-1, -1];
        }

        let matchGemSizeThanFour = listMatchGem.find(gemMatch => gemMatch.sizeMatch > 4);

        if (matchGemSizeThanFour) {
            return matchGemSizeThanFour.getIndexSwapGem();
        }

        let matchGemSizeThanThree = listMatchGem.find(gemMatch => gemMatch.sizeMatch > 3);

        if (matchGemSizeThanThree) {
            return matchGemSizeThanThree.getIndexSwapGem();
        }

        let matchGemSword = listMatchGem.find(gemMatch => gemMatch.type == GemType.SWORD);

        if (matchGemSword) {
            return matchGemSword.getIndexSwapGem();
        }

        console.log("myHeroGemType: ", this.myHeroGemType, "| Array.from(this.myHeroGemType)", Array.from(this.myHeroGemType));

        let matchGemType = listMatchGem.find(gemMatch => Array.from(this.myHeroGemType).includes(gemMatch.type));

        console.log("matchGem: ", matchGemType);


        if (matchGemType) {
            console.log("matchGemType ");
            return matchGemType.getIndexSwapGem();
        }

        console.log("listMatchGem[0].getIndexSwapGem() ", listMatchGem[0].getIndexSwapGem());

        return listMatchGem[0].getIndexSwapGem();
    }

    suggestMatch() {
        let listMatchGem = [];

        const tempGems = [...this.gems];

        tempGems.forEach(currentGem => {

            let swapGem = null;
            // If x > 0 => swap left & check

            // console.log("currentGem : ", currentGem);
            if (currentGem.x > 0) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x - 1), parseInt(currentGem.y))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If x < 7 => swap right & check
            if (currentGem.x < 7) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x + 1), parseInt(currentGem.y))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If y < 7 => swap up & check
            if (currentGem.y < 7) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x), parseInt(currentGem.y + 1))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
            // If y > 0 => swap down & check
            if (currentGem.y > 0) {

                swapGem = this.gems[this.getGemIndexAt(parseInt(currentGem.x), parseInt(currentGem.y - 1))];

                this.checkMatchSwapGem(listMatchGem, currentGem, swapGem);
            }
        })
        return listMatchGem;
    }

    checkMatchSwapGem(listMatchGem, currentGem, swapGem) {

        if(currentGem.locked || swapGem.locked) {
            return;
        }

        this.swap(currentGem, swapGem);

        let matchGems = this.matchesAt(parseInt(currentGem.x), parseInt(currentGem.y));
        this.swap(currentGem, swapGem);


        if (matchGems.size > 0) {
            listMatchGem.push(new GemSwapInfo(currentGem.index, swapGem.index, matchGems.size, currentGem.type));
        }
    }

    getGemIndexAt(x, y) {
        return x + y * 8;
    }

    swap(a, b) {
        let tempIndex = a.index;
        let tempX = a.x;
        let tempY = a.y;

        // update reference
        this.gems[a.index] = b;
        this.gems[b.index] = a;

        // update data of element
        a.index = b.index;
        a.x = b.x;
        a.y = b.y;

        b.index = tempIndex;
        b.x = tempX;
        b.y = tempY;
    }

    swapIndex(index1, index2) {
        const gem1 = this.gems[index1];
        const gem2 = this.gems[index2];
        return this.swap(gem1, gem2);
    }

    matchesAt(x, y) {
        let res = new Set();

        let center = this.gemAt(x, y);

        if(center.type === -1 || center.removed || center.locked) {
            return res;
        }

        if (center === undefined) {

            console.error("gem center undefined");
            return res;
        }

        // check horizontally
        let hor = [];
        hor.push(center);
        let xLeft = x - 1, xRight = x + 1;
        while (xLeft >= 0) {
            let gemLeft = this.gemAt(xLeft, y);
            if (gemLeft) {
                if (!gemLeft.sameType(center)) {
                    break;
                }
                hor.push(gemLeft);
            }
            xLeft--;
        }
        while (xRight < 8) {
            let gemRight = this.gemAt(xRight, y);
            if (gemRight) {
                if (!gemRight.sameType(center)) {
                    break;
                }
                hor.push(gemRight);
            }
            xRight++;
        }
        if (hor.length >= 3) hor.forEach(gem => res.add(gem));

        // check vertically
        let ver = [];
        ver.push(center);
        let yBelow = y - 1, yAbove = y + 1;
        while (yBelow >= 0) {
            let gemBelow = this.gemAt(x, yBelow);
            if (gemBelow) {
                if (!gemBelow.sameType(center)) {
                    break;
                }
                ver.push(gemBelow);
            }
            yBelow--;
        }
        while (yAbove < 8) {
            let gemAbove = this.gemAt(x, yAbove);
            if (gemAbove) {
                if (!gemAbove.sameType(center)) {
                    break;
                }
                ver.push(gemAbove);
            }
            yAbove++;
        }
        if (ver.length >= 3) ver.forEach(gem => res.add(gem));

        return res;
    }

    // Find Gem at Position (x, y)
    gemAt(x, y) {
        return this.gems.find(g => g.x === x && g.y === y)
    }

    performSwap(index1, index2) {
        const currentGem = this.gems[index1];
        const swapGem = this.gems[index2];
        console.log(currentGem, swapGem);
        this.swap(currentGem, swapGem);
        const allMatchGems = this.getAllMatches();
        const result = this.performDistinction(allMatchGems);
        return result;
    }
    
    getAllMatches() {
        const matches = [];
        for(const gem of this.gems) {
            const matchGems = this.matchesAt(parseInt(gem.x), parseInt(gem.y)); 
            if(matchGems.size > 0) {
                matches.push(matchGems);
            }
        }
        return matches.length > 0 ? [union(matches)] : [];
    }
    
    performDistinction(allMatchGems) {
        const removedBatch = [];
        for(const matchGems of allMatchGems) {
            const removed = this.distinctGemBatch(matchGems)
            removedBatch.push(removed);
        }
        this.performReshape();
        const nextMatches = this.getAllMatches();
        if(nextMatches.length > 0) {
            const nextRemoved = this.performDistinction(nextMatches);
            removedBatch.push(...nextRemoved);
        } 
        return removedBatch;
    }

    distinctGemBatch(gems) {
        const removedGems = [];
        const matchSize = gems.size;
        const maxLinearMatchSize = this.maxLinearMatch(gems);
        for(const gem of gems) {
            const removed = this.distinctGem(gem);
            removedGems.push(removed);
        }
        const isExtraTurn = maxLinearMatchSize > 4;
        return {
            matchSize,
            removedGems,
            isExtraTurn
        }
    }

    maxLinearMatch(gems) {
        const matchesX = {};
        const matchesY = {};

        for(const gem of gems) {
            matchesX[gem.x] = matchesX[gem.x] ? 1 : matchesX[gem.x] + 1;  
            matchesY[gem.y] = matchesY[gem.y] ? 1 : matchesY[gem.y] + 1;  
        }

        const maxX = Math.max(...Object.values(matchesX));
        const maxY = Math.max(...Object.values(matchesY));
        return Math.max(maxX, maxY);

    }

    distinctGem(gem) {
        gem.removed = true;
        return gem.clone();
    }

    performReshape() {
        for(const gem of this.gems) {
            if(gem.removed) {
                const aboveGem = this.gemAt(gem.x, gem.y + 1);
                if(!aboveGem) {
                    gem.removed = false;
                    gem.locked = true;
                    gem.type = -1;
                } else {
                    gem.type = aboveGem.type;
                    gem.locked = aboveGem.locked;
                    gem.removed = aboveGem.removed;
                    aboveGem.removed = true;
                    aboveGem.type = -1;
                }
            }
        }

        const toRemove = this.gems.find(gem => gem.removed);
        if(toRemove) {
            this.performReshape();
        }
        return false;
    }

    clone() {
        const cloned = new Grid({ size: () => 0 }, new Set());
        cloned.gems = this.gems.map(gem => gem.clone());
        cloned.gemTypes = new Set(Array.from(this.gemTypes));
        this.myHeroGemType = new Set(Array.from(this.myHeroGemType || []));
        return cloned;
    }
}