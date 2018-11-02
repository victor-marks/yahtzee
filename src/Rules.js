/** Rule for Yahtzee scoring. 
 * 
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 * 
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 */

class Rule {
  constructor(params) {
    // put all properties in params on instance
    Object.assign(this, params);
  }

  sum(dice) {
    // sum of all dice
    return dice.reduce((prev, curr) => prev + curr);
  }

  // makes a Map like { 5:2, 2:2, 1:1 } if dice are 5, 2, 1, 2, 5
  // returns array of [2, 2, 1]
  freq(dice) {
    // frequencies of dice values
    const freqs = new Map();
    for (let d of dice)
      freqs.set(d, (freqs.get(d) || 0) + 1);
    return Array.from(freqs.values());
  }

  count(dice, val) {
    // # times val appears in dice
    return dice.filter(d => d === val).length;
  }
}


/** Given a sought-for val, return sum of dice of that val. 
 * 
 * Used for rules like "sum of all ones"
*/

class TotalOneNumber extends Rule {
  evalRoll = (dice) => {
    return this.val * this.count(dice, this.val);
  }
}

/** Given a required # of same dice, return sum of all dice. 
 * 
 * Used for rules like "sum of all dice when there is a 3-of-kind"
*/

// count is assigned when instance of sumDistro created ie. 4 of a kind means count is 4
// checks whether freq is 4, returns sum of ALL dice

class SumDistro extends Rule {
  evalRoll = (dice) => {
    //  any of the counts meet of exceed this distro?
    return (this.freq(dice).some(c => c >= this.count)) ? this.sum(dice) : 0;
  }
}

/** Check if full house (3-of-kind and 2-of-kind) */

class FullHouse extends Rule {
  // TODO
  evalRoll = (dice) => {

    let f = this.freq(dice);

    if ((f[0] === 3 && f[1] === 2) || (f[0] === 2 && f[1] === 3)) {
      return this.score
    } else {
      return 0
    }

  }
}

/** Check for small straights. */

class SmallStraight extends Rule {
  // TODO
  evalRoll = (dice) => {
    const d = Array.from(new Set(dice)).sort();
    let highestConsec = 0;
    let consecutive = 1;
    for (let i = 0; i < d.length - 1; i++) {
      if (d[i] + 1 === d[i + 1]) {
        consecutive++;
        highestConsec = Math.max(highestConsec, consecutive)
        // if (consecutive >= highestConsec) {
        //   highestConsec = consecutive;
        // }
      }
      else {
        consecutive = 1;
      }
    }
    if (highestConsec >= 4) {
      return this.score
    }
    else {
      return 0;
    }
  }


}

/** Check for large straights. */

class LargeStraight extends Rule {
  evalRoll = (dice) => {
    const d = new Set(dice);

    // large straight must be 5 different dice & only one can be a 1 or a 6
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  }
}

/** Check if all dice are same. */

// all dice must be same to guarantee yahtzee, check in freq(dice)
class Yahtzee extends Rule {
  evalRoll = (dice) => {
    // all dice must be the same
    return (this.freq(dice)[0] === 5) ? this.score : 0;
  }
}

// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1 });
const twos = new TotalOneNumber({ val: 2 });
const threes = new TotalOneNumber({ val: 3 });
const fours = new TotalOneNumber({ val: 4 });
const fives = new TotalOneNumber({ val: 5 });
const sixes = new TotalOneNumber({ val: 6 });

// three/four of kind score as sum of all dice
const threeOfKind = new SumDistro({ count: 3 });
const fourOfKind = new SumDistro({ count: 4 });

// full house scores as flat 25
const fullHouse = new FullHouse({ score: 25 });

// small/large straights score as 30/40
const smallStraight = new SmallStraight({ score: 30 });
const largeStraight = new LargeStraight({ score: 40 });

// yahtzee scores as 50
const yahtzee = new Yahtzee({ score: 50 });

// for chance, can view as some of all dice, requiring at least 0 of a kind
const chance = new SumDistro({ count: 0 });

export {
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance
};
