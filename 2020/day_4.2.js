const fs = require('fs');
const path = require('path');


const CHAR_0 = 48;
const CHAR_1 = 49;
const CHAR_2 = 50;
const CHAR_3 = 51;
const CHAR_4 = 52;
const CHAR_5 = 53;
const CHAR_6 = 54;
const CHAR_7 = 55;
const CHAR_8 = 56;
const CHAR_9 = 57;

const CHAR_a = 97;
const CHAR_b = 98;
const CHAR_c = 99;
const CHAR_d = 100;
const CHAR_e = 101;
const CHAR_f = 102;
const CHAR_z = 122;


class Processor {

  constructor() {
    this.STATE_DONE_ERROR = 'DONE_ERROR';
    this.STATE_DONE_VALID = 'DONE_VALID';
    this.STATE_EMPTY = 'EMPTY';

    this.length = 0;
    this.state = this.STATE_EMPTY;

    this.transitions = {};
  }

  nextCharacter(chr) {
    let nextState = '';

    if (this.willBeDoneValid(chr)) {
      nextState = this.STATE_DONE_VALID;
    } else if (this.transitions.hasOwnProperty(this.state)
      && this.transitions[this.state].hasOwnProperty(this.length)
      && this.transitions[this.state][this.length].hasOwnProperty(chr)
    ) {
      nextState = this.transitions[this.state][this.length][chr];
    } else {
      //console.log(`  entering error state from ${this.state}
      //  with length ${this.length} and chr (${chr})`);
      nextState = this.STATE_DONE_ERROR;
    }

    this.transition(nextState);
  }

  transition(nextState) {
    this.length++;
    this.state = nextState;
  }

  isDoneError() {
    return this.state === this.STATE_DONE_ERROR;
  }

  isDoneValid() {
    return this.state === this.STATE_DONE_VALID;
  }

}


class BirthYearProcessor extends Processor {

  constructor() {
    super();

    this.STATE_ZERO = 'ZERO';
    this.STATE_ONE = 'ONE';
    this.STATE_TWO = 'TWO';
    this.STATE_TWO_PLUS = 'TWO_PLUS';
    this.STATE_NINE = 'NINE';
    this.STATE_ANY_DIGIT = 'ANY_DIGIT';

    // TODO:  think more about how to structure this.
    //        remember that fromEmpty is a special case
    this.transitions[this.STATE_EMPTY] = {
      0: {
        '1': this.STATE_ONE,
        '2': this.STATE_TWO,
      },
    };

    this.transitions[this.STATE_ONE] = {
      1: {
        '9': this.STATE_NINE,
      },
    };

    this.transitions[this.STATE_NINE] = {
      2: {
        '2': this.STATE_TWO_PLUS,
        '3': this.STATE_TWO_PLUS,
        '4': this.STATE_TWO_PLUS,
        '5': this.STATE_TWO_PLUS,
        '6': this.STATE_TWO_PLUS,
        '7': this.STATE_TWO_PLUS,
        '8': this.STATE_TWO_PLUS,
        '9': this.STATE_TWO_PLUS,
      }
    };

    this.transitions[this.STATE_TWO_PLUS] = {
      3: {
        '0': this.STATE_ANY_DIGIT,
        '1': this.STATE_ANY_DIGIT,
        '2': this.STATE_ANY_DIGIT,
        '3': this.STATE_ANY_DIGIT,
        '4': this.STATE_ANY_DIGIT,
        '5': this.STATE_ANY_DIGIT,
        '6': this.STATE_ANY_DIGIT,
        '7': this.STATE_ANY_DIGIT,
        '8': this.STATE_ANY_DIGIT,
        '9': this.STATE_ANY_DIGIT,
      }
    };

    this.transitions[this.STATE_TWO] = {
      1: {
        '0': this.STATE_ZERO,
      },
    };

    this.transitions[this.STATE_ZERO] = {
      2: {
        '0': this.STATE_ZERO,
      },
      3: {
        '0': this.STATE_ZERO,
        '1': this.STATE_ONE,
        '2': this.STATE_TWO,
      },
    }
  }

  willBeDoneValid(chr) {
    return (
      this.length === 4
      && (chr === ' ' || chr === '\n' || chr === '\r')
      && (
        this.state === this.STATE_ANY_DIGIT
        || this.state === this.STATE_ZERO
        || this.state === this.STATE_ONE
        || this.state === this.STATE_TWO
      )
    );
  }
}


class IssueYearProcessor extends Processor {
  constructor() {
    super();
    this.STATE_ZERO = 'ZERO';
    this.STATE_ONE = 'ONE';
    this.STATE_TWO = 'TWO';
    this.STATE_ANY_DIGIT = 'ANY_DIGIT';
    this.transitions = {
      [this.STATE_EMPTY]: {
        0: {
          '2': this.STATE_TWO,
        }
      },
      [this.STATE_ZERO]: {
        2: {
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
        },
      },
      [this.STATE_ONE]: {
        3: {
          '0': this.STATE_ANY_DIGIT,
          '1': this.STATE_ANY_DIGIT,
          '2': this.STATE_ANY_DIGIT,
          '3': this.STATE_ANY_DIGIT,
          '4': this.STATE_ANY_DIGIT,
          '5': this.STATE_ANY_DIGIT,
          '6': this.STATE_ANY_DIGIT,
          '7': this.STATE_ANY_DIGIT,
          '8': this.STATE_ANY_DIGIT,
          '9': this.STATE_ANY_DIGIT,
        }
      },
      [this.STATE_TWO]: {
        1: {
          '0': this.STATE_ZERO,
        },
        3: {
          '0': this.STATE_ZERO,
        },
      },
    };
  }

  willBeDoneValid(chr) {
    return (
      this.length === 4
      && (chr === ' ' || chr === '\n' || chr === '\r')
      && (
        this.state === this.STATE_ANY_DIGIT
        || this.state === this.STATE_ZERO
      )
    );
  }
}


class ExpYearProcessor extends Processor {
  constructor() {
    super();

    this.STATE_ZERO = 'ZERO';
    this.STATE_TWO = 'TWO';
    this.STATE_THREE = 'THREE';
    this.STATE_ANY_DIGIT = 'ANY_DIGIT';

    this.transitions = {
      [this.STATE_EMPTY]: {
        0: {
          '2': this.STATE_TWO,
        }
      },
      [this.STATE_ZERO]: {
        2: {
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
        },
      },
      [this.STATE_TWO]: {
        1: {
          '0': this.STATE_ZERO,
        },
        3: {
          '0': this.STATE_ANY_DIGIT,
          '1': this.STATE_ANY_DIGIT,
          '2': this.STATE_ANY_DIGIT,
          '3': this.STATE_ANY_DIGIT,
          '4': this.STATE_ANY_DIGIT,
          '5': this.STATE_ANY_DIGIT,
          '6': this.STATE_ANY_DIGIT,
          '7': this.STATE_ANY_DIGIT,
          '8': this.STATE_ANY_DIGIT,
          '9': this.STATE_ANY_DIGIT,
        }
      },
      [this.STATE_THREE]: {
        3: {
          '0': this.STATE_ZERO,
        },
      },
    };
  }

  willBeDoneValid(chr) {
    return (
      this.length === 4
      && (chr === ' ' || chr === '\n' || chr === '\r')
      && (
        this.state === this.STATE_ANY_DIGIT
        || this.state === this.STATE_ZERO
      )
    );
  }
}


class HeightProcessor extends Processor {
  constructor() {
    super();

    this.STATE_ZERO = 'ZERO';
    this.STATE_ONE = 'ONE';
    this.STATE_TWO = 'TWO';
    this.STATE_THREE = 'THREE';
    this.STATE_FOUR = 'FOUR';
    this.STATE_FIVE = 'FIVE';
    this.STATE_SIX = 'SIX';
    this.STATE_SEVEN = 'SEVEN';
    this.STATE_EIGHT = 'EIGHT';
    this.STATE_NINE = 'NINE';
    this.STATE_CHAR_ONE = 'CHAR_ONE';
    this.STATE_CHAR_TWO = 'CHAR_TWO';

    this.transitions = {
      [this.STATE_EMPTY]: {
        0: {
          '1': this.STATE_ONE,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
        }
      },
      [this.STATE_ZERO]: {
        2: {
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_ONE]: {
        1: {
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
        },
        2: {
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_TWO]: {
        2: {
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_THREE]: {
        2: {
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_FOUR]: {
        2: {
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_FIVE]: {
        1: {
          '9': this.STATE_NINE,
        },
        2: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_SIX]: {
        2: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_SEVEN]: {
        1: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
        },
        2: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_EIGHT]: {
        2: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          '4': this.STATE_FOUR,
          '5': this.STATE_FIVE,
          '6': this.STATE_SIX,
          '7': this.STATE_SEVEN,
          '8': this.STATE_EIGHT,
          '9': this.STATE_NINE,
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_NINE]: {
        2: {
          'i': this.STATE_CHAR_ONE,
        },
        3: {
          '0': this.STATE_ZERO,
          '1': this.STATE_ONE,
          '2': this.STATE_TWO,
          '3': this.STATE_THREE,
          'c': this.STATE_CHAR_ONE,
        },
      },
      [this.STATE_CHAR_ONE]: {
        3: {
          'n': this.STATE_CHAR_TWO,
        },
        4: {
          'm': this.STATE_CHAR_TWO,
        },
      },
      //[this.STATE_CHAR_TWO]: { },
      // This state can only go to ERROR or VALID.
    };
  }

  willBeDoneValid(chr) {
    return (
      (this.length === 4 || this.length === 5)
      && this.state === this.STATE_CHAR_TWO
      && (chr === ' ' || chr === '\n' || chr === '\r')
    );
  }
}


class HairColorProcessor extends Processor {
  constructor() {
    super();

    this.STATE_POUND = 'POUND';
    this.STATE_HEXADECIMAL = 'HEXADECIMAL';
  }

  willBeDoneValid(chr) {
    return (
      this.length === 7
      && this.state === this.STATE_HEXADECIMAL
      && (chr === ' ' || chr === '\n' || chr === '\r')
    );
  }

  nextCharacter(chr) {
    let nextState = '';

    if (this.willBeDoneValid(chr)) {
      nextState = this.STATE_DONE_VALID;
    } else if (this.state === this.STATE_EMPTY && this.length === 0 && chr === '#') {
      nextState = this.STATE_POUND;
    } else if (this.state === this.STATE_POUND
      && this.length === 1
      && (
        (CHAR_0 <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_9)
        || (CHAR_a <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_f)
      )
    ) {
      nextState = this.STATE_HEXADECIMAL;
    } else if (this.state === this.STATE_HEXADECIMAL
      && 2 <= this.length
      && this.length <= 7
      && (
        (CHAR_0 <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_9)
        || (CHAR_a <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_f)
      )
    ) {
      nextState = this.STATE_HEXADECIMAL;
    } else {
      //console.log(`  entering error state from ${this.state}
      //  with length ${this.length} and chr (${chr})`);
      nextState = this.STATE_DONE_ERROR;
    }

    this.transition(nextState);
  }
}


class EyeProcessor extends Processor {
  constructor() {
    super();

    this.STATE_AMBER = 'AMBER';
    this.STATE_B_SOMETHING = 'B_SOMETHING';
    this.STATE_G_SOMETHING = 'G_SOMETHING';
    this.STATE_BLUE = 'BLUE';
    this.STATE_BROWN = 'BROWN';
    this.STATE_GRAY = 'GRAY';
    this.STATE_GREEN = 'GREEN';
    this.STATE_HAZEL = 'HAZEL';
    this.STATE_OTHER = 'OTHER';

    this.transitions =  {
      [this.STATE_EMPTY]: {
        0: {
          'a': this.STATE_AMBER,
          'b': this.STATE_B_SOMETHING,
          'g': this.STATE_G_SOMETHING,
          'h': this.STATE_HAZEL,
          'o': this.STATE_OTHER,
        },
      },
      [this.STATE_AMBER]: {
        1: {
          'm': this.STATE_AMBER,
        },
        2: {
          'b': this.STATE_AMBER,
        },
      },
      [this.STATE_B_SOMETHING]: {
        1: {
          'l': this.STATE_BLUE,
          'r': this.STATE_BROWN,
        },
      },
      [this.STATE_BLUE]: {
        3: {
          'u': this.STATE_BLUE,
        },
      },
      [this.STATE_BROWN]: {
        3: {
          'n': this.STATE_BROWN,
        },
      },
      [this.STATE_G_SOMETHING]: {
        1: {
          'r': this.STATE_G_SOMETHING,
        },
        2: {
          'n': this.STATE_GREEN,
          'y': this.STATE_GRAY,
        },
      },
      [this.STATE_OTHER]: {
        2: {
          't': this.STATE_OTHER,
        },
        3: {
          't': this.STATE_OTHER,
        },
      },
    };
  }

  willBeDoneValid(chr) {
    return (
      this.length === 3
      && (chr === ' ' || chr === '\n' || chr === '\r')
      && this.state !== this.STATE_DONE_ERROR
    );
  }
}


class PassportProcessor extends Processor {
  constructor() {
    super();
    this.STATE_NUM = 'NUM';
  }

  willBeDoneValid(chr) {
    return (
      this.state === this.STATE_NUM
      && this.length === 9
      && (chr === ' ' || chr === '\n' || chr === '\r')
    );
  }

  nextCharacter(chr) {
    let nextState = '';

    if (this.willBeDoneValid(chr)) {
      nextState = this.STATE_DONE_VALID;
    } else if (this.state === this.STATE_EMPTY
      && this.length === 0 
      && CHAR_0 <= chr.charCodeAt(0)
      && chr.charCodeAt(0) <= CHAR_9
    ) {
      nextState = this.STATE_NUM;
    } else if (this.state === this.STATE_NUM
      && 1 <= this.length
      && this.length <= 9
      && CHAR_0 <= chr.charCodeAt(0)
      && chr.charCodeAt(0) <= CHAR_9
    ) {
      nextState = this.STATE_NUM;
    } else {
      //console.log(`  entering error state from ${this.state}
      //  with length ${this.length} and chr (${chr})`);
      nextState = this.STATE_DONE_ERROR;
    }

    this.transition(nextState);
  }
}


// TODO: finish this?
class StreamProcessor {
  constructor() {
    this.idx = 0;

    this.key = '';
    // Only used for logging
    this.value = '';
    this.segmentLength = 0;

    this.STATE_COMPLETE = 'COMPLETE';
    this.STATE_ERROR = 'ERROR';
    this.STATE_GARBAGE = 'GARBAGE';
    this.STATE_KEY = 'KEY';
    this.STATE_NEWLINE = 'NEWLINE';
    this.STATE_PROCESS_SEGMENT = 'PROCESS_SEGMENT';
    this.STATE_PROCESS_VALUE = 'PROCESS_VALUE';
    this.STATE_SPACE = 'SPACE';
    this.STATE_VALUE = 'VALUE';

    this.state = this.STATE_NEWLINE;

    this.transitions = {
      [this.STATE_GARBAGE]: (chr) => {
        if (chr === '\n') {
          return this.STATE_NEWLINE;
        } else if (chr === ' ') {
          return this.STATE_SPACE;
        } else if ((CHAR_a <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_z)
          || (CHAR_0 <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_9)
        ) {
          return this.STATE_GARBAGE;
        }
        console.log(`  Error transitioning out of state (${this.state}) with chr(${chr})`);
        return this.STATE_ERROR;
      },
      [this.STATE_KEY]: (chr) => {
        if (chr === ':') {
          return this.STATE_VALUE;
        } else if (CHAR_a <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_z) {
          return this.STATE_KEY;
        }
        console.log(`  Error transitioning out of state (${this.state}) with chr(${chr})`);
        return this.STATE_ERROR;
      },
      [this.STATE_NEWLINE]: (chr) => {
        if (chr === '\n') {
          return this.PROCESS_SEGMENT;
        } else if (chr === ' ') {
          return this.STATE_SPACE;
        } else if (CHAR_a <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_z) {
          return this.STATE_KEY;
        }
        console.log(`  Error transitioning out of state (${this.state}) with chr(${chr})`);
        return this.STATE_ERROR;
      },
      [this.STATE_VALUE]: (chr) => {
        if ((CHAR_a <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_z)
          || (CHAR_0 <= chr.charCodeAt(0) && chr.charCodeAt(0) <= CHAR_9)
          || chr === '#'
        ) {
          return this.STATE_VALUE;
        } else if (chr === '\n' || chr === ' ') {
          // TODO: think about how to track this state/threshold
          return this.PROCESS_VALUE;
        }
      },
      [this.STATE_SPACE]: {
        [this.STATE_NEWLINE]: () => (true),
        [this.STATE_SPACE]: () => (true),
      },
    };
  }

  processCharacter(chr) {
  }
}


const PROCESSORS = {
  byr: () => (new BirthYearProcessor()),
  iyr: () => (new IssueYearProcessor()),
  eyr: () => (new ExpYearProcessor()),
  hgt: () => (new HeightProcessor()),
  hcl: () => (new HairColorProcessor()),
  ecl: () => (new EyeProcessor()),
  pid: () => (new PassportProcessor()),
};



function getRawData() {
  const datafile = path.resolve(__dirname, 'day_4.data.txt');
  const rawData = fs.readFileSync(datafile, { encoding: 'UTF-8' });
  return rawData;
}

function getRequiredFields() {
  return {
    byr: false,
    iyr: false,
    eyr: false,
    hgt: false,
    hcl: false,
    ecl: false,
    pid: false,
  };
}


function main() {
  const rawData = getRawData();

  let countValid = 0;
  let countTotal = 0;

  let c = 0;
  let fields = getRequiredFields();
  let key = '';
  let inGarbage = false;
  let inKey = false;
  let inValue = false;
  let processor = null;
  let hasAllRequiredFields = false;

  while (c < rawData.length) {
    if (!inKey
      && !inValue
      && !inGarbage
      && CHAR_a <= rawData.charCodeAt(c)
      && rawData.charCodeAt(c) <= CHAR_z
    ) {
      inKey = true;
    } else if (inKey && rawData[c] === ':' && !inGarbage) {
      inKey = false;
      inValue = true;
      key = rawData.substring((c-3), c);
      if (PROCESSORS.hasOwnProperty(key)) {
        processor = PROCESSORS[key]();
      } else {
        inGarbage = true;
        inValue = false;
      }
    } else if (inValue) {
      processor.nextCharacter(rawData[c]);
      if (processor.isDoneError()) {
        inGarbage = true;
        inValue = false;
        fields[key] = false;
      } else if (processor.isDoneValid()) {
        inValue = false;
        fields[key] = true;
      }
      // else - state machine is happily processing characters
    } else if (rawData[c] === ' ' || rawData[c] === '\n' || rawData[c] === '\r') {
      inGarbage = false;
    }

    if ((rawData[c-1] === '\n' || rawData[c-1] === '\r')
      && (rawData[c] === '\n' || rawData[c] === '\r')
    ) {
      inGarbage = false;
      inKey = false;
      inValue = false;

      hasAllRequiredFields = Object.values(fields).reduce(
        (hasAll, exists) => (hasAll && exists),
        true
      );
      if (hasAllRequiredFields) {
        countValid++;
      }
 
      processor = null;
      fields = getRequiredFields();
    }

    c++;
  }

  hasAllRequiredFields = Object.values(fields).reduce(
    (hasAll, exists) => (hasAll && exists),
    true
  );
  if (hasAllRequiredFields) {
    countValid++;
  }

  console.log(`Found ${countValid} valid passports`);
}

main();


