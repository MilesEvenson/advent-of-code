import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Parse basic Packet data out of the input transmission:
//    - rawData
//    - subPackets
//    - typeID
//    - version
//
//  Parsing a packet:
//    - convert hex characters, one at a time, to a long binary string
//      - version
//      - typeID
//    - if Literal
//      - walk 5-char words
//    - else - Op
//      - if LengthType TotalBitLength
//        - process packets by length (TODO)
//      - else - LengthType CountSubPackets
//        - process packets by count (TODO)
//    - ignore possible trailing binary digits. Not clear if this will happen in full data.
//
//
//  It's not clear if I need to handle trailing binary data at the
//  end of packets in the full input.
//  I will assume "no" for now.
//
//  Use recursion to parse sub-packets, keeping the full
//  binary string in scope so the recursive calls can take
//  a start index as a param
//
//
//
//
//
// Complexity Analysis:
//
//  Time Complexity:
//
//  Space complexity:
//
//
// Total time,    ????  minutes
//  Planning       ??
//  Programming    ??
//  Debugging      ??
//
//
//
//


interface Analysis {
  totalPackets: number;
  allVersionNumbers: number[];
}


interface Example {
  label: string;
  transmission: string;
  totalPackets: number;
  versionSum: number;
}


interface Packet {
  rawData: string;
  subPackets: Packet[];
  typeID: number;
  version: number;
}


const TYPE_LITERAL = 4;


const SAMPLE_DATA: Record<string, Example> = {
  A: {
    label: 'A',
    transmission: 'D2FE28',
    totalPackets: 1,
    versionSum: 4,
  },
  B: {
    label: 'B',
    transmission: '38006F45291200',
    totalPackets: 4,
    versionSum: 7,
  },
  C: {
    label: 'C',
    transmission: 'EE00D40C823060',
    totalPackets: 4,
    versionSum: 4,
  },
  D: {
    label: 'D',
    transmission: '8A004A801A8002F478',
    totalPackets: 4,
    versionSum: 16,
  },
  E: {
    label: 'E',
    transmission: '620080001611562C8802118E34',
    totalPackets: 3,
    versionSum: 12,
  },
  F: {
    label: 'F',
    transmission: 'C0015000016115A2E0802F182340',
    totalPackets: 3,
    versionSum: 23,
  },
  G: {
    label: 'G',
    transmission: 'A0016C880162017C3686B18A3D4780',
    totalPackets: 3,
    versionSum: 31,
  },
};


const HEX_MAP: Record<string, string> = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  'A': '1010',
  'B': '1011',
  'C': '1100',
  'D': '1101',
  'E': '1110',
  'F': '1111',
};


function isFull(): boolean {
  return (process.env.SOURCE === 'FULL');
}


function getFullTransmission(): string {
  const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_16.input.txt'));
  return buffInput.toString().trim();
}


function hex2bin(hex: string): string {
  let words: string[] = [];
  for (let c = 0; c < hex.length; c++) {
    words.push(HEX_MAP[hex[c]]);
  }
  return words.join('');
}


function processTransmission(hexData: string): Packet {
  const binData = hex2bin(hexData);
  console.log('Processing transmission:');
  console.log(hexData);
  console.log(binData);

  function parseVersion(idxStart: number): number {
    return parseInt(`${binData[idxStart]}${binData[idxStart+1]}${binData[idxStart+2]}`, 2);
  }

  function parseTypeID(idxStart: number): number {
    return parseInt(`${binData[idxStart]}${binData[idxStart+1]}${binData[idxStart+2]}`, 2);
  }

  function parseLiteralValue(idxStart: number): string {
    // take 5-char words out of binData until finding one that starts with '0'
    let offset = idxStart;
    let words: string[] = [];
    while (binData[offset] != '0') {
      words.push(`${binData[offset+1]}${binData[offset+2]}${binData[offset+3]}${binData[offset+4]}`);
      offset += 5;
    }
    words.push(`${binData[offset+1]}${binData[offset+2]}${binData[offset+3]}${binData[offset+4]}`);
    return words.join('');
  }

  function parsePacket(idxStart: number): Packet {
    let offset = idxStart;
    const version = parseVersion(offset);
    offset += 3;
    const typeID = parseTypeID(offset);
    offset += 3;

    if (typeID == TYPE_LITERAL) { 
      return {
        rawData: parseLiteralValue(offset),
        subPackets: [],
        typeID: typeID,
        version: version,
      }
    } else {
      // TODO: check length type!
    }

    return {
      rawData: '',
      subPackets: [],
      typeID: 0,
      version: 0,
    };
  } // end - parsePacket()


  const rootPacket = parsePacket(0);
  console.dir(rootPacket);

  return {
    rawData: '',
    subPackets: [],
    typeID: 0,
    version: 0,
  };
}


function analyzePacket(packet: Packet): Analysis {
  const report = {
    totalPackets: 1,
    allVersionNumbers: [ packet.version ],
  };
  if (packet.subPackets.length == 0) {
    return report;
  }
  let subVersions: number[] = [];
  packet.subPackets.forEach(sp => {
    const subReport = analyzePacket(sp);
    report.totalPackets += subReport.totalPackets;
    subVersions = subVersions.concat(subReport.allVersionNumbers);
  });
  report.allVersionNumbers = subVersions;
  return report;
}


function processSampleData(): void {
  Object.values(SAMPLE_DATA)
    .forEach(example => {
      processTransmission(example.transmission);
    });
}



function day16_1(): void {
  console.log('Welcome to Day 16.1. Packets all the way down.');

  if (isFull()) {
    const fullReport = analyzePacket(processTransmission(getFullTransmission()));
    const versionsFlat = fullReport.allVersionNumbers.flat(fullReport.totalPackets);
    const sumVersionNumbers = versionsFlat.reduce((s, v) => (s + v), 0);
    console.log(`Processed (${fullReport.totalPackets}) packets to get sum (${sumVersionNumbers}).`);
  } else {
    processSampleData();
  }
}


day16_1();

