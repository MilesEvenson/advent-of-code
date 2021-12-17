import * as fs from 'fs';
import path from 'path';


//
// First attempt:
//  Create a new enum for all the packet types.
//
//  Keep the existing tree parsing logic from 16.1.
//  I don't think I need to change anything here because
//  the new enum type should work seamlessly with existing typeID.
//
//  Add new recursive function to process each Packet.
//    - if packet is Value
//      - return value as number
//    - map values from subPackets with recursive calls
//    - switch packet type
//      - run corresponding operation
//      - return resulting value
//
//
// Complexity Analysis:
//  B: length of binary string
//  P: number of packets
//
//  Time Complexity:
//    O(B + P)
//    Process each binary digit to build the nested packet structure.
//    Process each packet recursively to determine the result.
//
//  Space complexity:
//    O(B + P)
//    Store the entire binary string in memory.
//    Store the entire nested packet structure in memory.
//
//
//
//
//



interface Example {
  label: string;
  transmission: string;
  totalPackets: number;
  versionSum: number;
}


interface Packet {
  lengthType?: LengthType,
  offset: number;
  rawData: string;
  subPacketBitLength: number;
  subPackets: Packet[];
  typeID: number;
  totalLength: number;
  version: number;
}


enum PacketType {
  Sum,
  Product,
  Min,
  Max,
  Value,
  GT,
  LT,
  EQ
}


enum LengthType {
  TotalBitLength = '0',
  CountSubPackets = '1',
}


const C_RESET = '\x1b[0m';


const SAMPLE_DATA: Record<string, Example> = {

  // Examples from 16.1

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

  // Examples from 16.2

  H: {
    label: 'H',
    transmission: 'C200B40A82',
    totalPackets: 3,
    versionSum: 31,
  },
  I: {
    label: 'I',
    transmission: '04005AC33890',
    totalPackets: 3,
    versionSum: 31,
  },
  J: {
    label: 'J',
    transmission: '880086C3E88112',
    totalPackets: 3,
    versionSum: 31,
  },
  K: {
    label: 'K',
    transmission: 'CE00C43D881120',
    totalPackets: 3,
    versionSum: 31,
  },
  L: {
    label: 'L',
    transmission: 'D8005AC2A8F0',
    totalPackets: 3,
    versionSum: 31,
  },
  M: {
    label: 'M',
    transmission: 'F600BC2D8F',
    totalPackets: 3,
    versionSum: 31,
  },
  N: {
    label: 'N',
    transmission: '9C005AC2F8F0',
    totalPackets: 3,
    versionSum: 31,
  },
  O: {
    label: 'O',
    transmission: '9C0141080250320F1802104A08',
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
function getErikTransmission(): string {
  const buffInput = fs.readFileSync(path.join(__dirname, 'data', 'day_16.input.erik.txt'));
  return buffInput.toString().trim();
}


function hex2bin(hex: string): string {
  let words: string[] = [];
  for (let c = 0; c < hex.length; c++) {
    words.push(HEX_MAP[hex[c]]);
  }
  return words.join('');
}


function dec2binString(int: number): string {
  return `${Number(int).toString(2)}`;
}


function padBinString(str: string, targetLength: number): string {
  while (str.length < targetLength) {
    str = '0' + str;
  }
  return str;
}


function packetToBinString(packet: Packet): string {
  const chunks: string[] = [];
  const binVersion = padBinString(dec2binString(packet.version), 3);
  const binTypeID = padBinString(dec2binString(packet.typeID), 3);
  chunks.push(`\x1b[32m${binVersion}${C_RESET}`);
  chunks.push(`\x1b[33m${binTypeID}${C_RESET}`);
  if (packet.typeID == PacketType.Value) {
    chunks.push(`\x1b[40m\x1b[37m${packet.rawData}${C_RESET}`);
  } else {
    chunks.push(`\x1b[36m${packet.lengthType}${C_RESET}`);
    if (packet.lengthType == LengthType.TotalBitLength) {
      chunks.push(`\x1b[2m\x1b[31m${padBinString(dec2binString(packet.subPacketBitLength), 15)}${C_RESET}`);
    } else {
      chunks.push(`\x1b[33m${padBinString(dec2binString(packet.subPackets.length), 11)}${C_RESET}`);
    }
    packet.subPackets.forEach(p => chunks.push(packetToBinString(p)));
  }
  return chunks.join('');
}


function valuePacketToDec(rawValue: string): number {
  const digits: string[] = [];
  for (let c = 0; c < rawValue.length; c++) {
    if (c % 5 != 0) {
      digits.push(rawValue[c]);
    }
  }
  return parseInt(digits.join(''), 2);
}


function processTransmission(hexData: string): Packet {
  const binData = hex2bin(hexData);
  console.log('Processing transmission:');
  console.log(hexData);
  console.log(binData);

  function parseDecInt(idxStart: number, fieldLength: number): number {
    let cursor = idxStart;
    while (binData[cursor] == '0' && cursor < (idxStart + fieldLength)) {
      cursor++;
    }
    let bits: string[] = [];
    for (cursor; cursor < (idxStart + fieldLength); cursor++) {
      bits.push(binData[cursor]);
    }
    if (bits.length == 0) {
      bits.push('0');
    }
    return parseInt(bits.join(''), 2);
  }

  function parseVersion(idxStart: number): number {
    return parseDecInt(idxStart, 3);
  }

  function parseTypeID(idxStart: number): number {
    return parseDecInt(idxStart, 3);
  }

  function parseLengthType(idxStart: number): LengthType {
    if (binData[idxStart] == LengthType.TotalBitLength) {
      return LengthType.TotalBitLength;
    }
    return LengthType.CountSubPackets;
  }

  function parseSubPacketBitLength(idxStart: number): number {
    return parseDecInt(idxStart, 15);
  }

  function parseSubPacketCount(idxStart: number): number {
    return parseDecInt(idxStart, 11);
  }

  function takeRawLiteralValue(idxStart: number): string {
    //console.log(`    taking raw literal value starting at (${idxStart}).`);
    // take 5-char words out of binData until finding one that starts with '0'
    let cursor = idxStart;
    let words: string[] = [];
    while (binData[cursor] != '0' && cursor < (binData.length - 10)) {
      // TODO: make this a little easier to read with a loop?
      words.push(`${binData[cursor]}${binData[cursor+1]}${binData[cursor+2]}${binData[cursor+3]}${binData[cursor+4]}`);
      cursor += 5;
    }
      // TODO: make this a little easier to read with a loop?
    words.push(`${binData[cursor]}${binData[cursor+1]}${binData[cursor+2]}${binData[cursor+3]}${binData[cursor+4]}`);
    return words.join('');
  }

  function parseSubPacketsByLength(idxStart: number, totalLength: number): Packet[] {
    let cursor = idxStart;
    let subPacket: Packet;
    const packets: Packet[] = [];
    while (cursor < (idxStart + totalLength)) {
      subPacket = parsePacket(cursor);
      packets.push(subPacket);
      cursor += subPacket.totalLength;
    }
    return packets;
  }

  function parseSubPacketsByCount(idxStart: number, totalPackets: number): Packet[] {
    let cursor = idxStart;
    let subPacket: Packet;
    const packets: Packet[] = [];
    while (packets.length < totalPackets) {
      subPacket = parsePacket(cursor);
      packets.push(subPacket);
      cursor += subPacket.totalLength;
    }

    return packets;
  }

  function parsePacket(idxStart: number): Packet {
    console.log(`parsePacket at (${idxStart})`);
    let cursor = idxStart;
    const version = parseVersion(cursor);
    //console.log(`  parsePacket got version (${version})`);
    cursor += 3;
    const typeID = parseTypeID(cursor);
    //console.log(`  parsePacket got typeID (${typeID})`);
    cursor += 3;

    const packet: Packet = {
      offset: idxStart,
      rawData: '',
      subPacketBitLength: 0,
      subPackets: [],
      totalLength: 6,
      typeID: typeID,
      version: version,
    };

    if (typeID == PacketType.Value) {
      packet.rawData = takeRawLiteralValue(cursor);
      packet.totalLength += packet.rawData.length;
    } else {
      const lengthType = parseLengthType(cursor);
      cursor += 1;
      packet.lengthType = lengthType;
      packet.totalLength += 1;
      if (lengthType == LengthType.TotalBitLength) {
        //console.log(`  new Op packet has length type (${lengthType}), total bit length.`);
        const totalLength = parseSubPacketBitLength(cursor);
        cursor += 15;
        //console.log(`  total bit length is (${totalLength})`);
        packet.subPackets = parseSubPacketsByLength(cursor, totalLength);
        packet.subPacketBitLength = totalLength;
        packet.totalLength += 15;
      } else {
        //console.log(`  new Op packet has length type (${lengthType}), count of sub-packets.`);
        const countSubPackets = parseSubPacketCount(cursor);
        cursor += 11;
        //console.log(`  expecting (${countSubPackets}) sub-packets`);
        packet.subPackets = parseSubPacketsByCount(cursor, countSubPackets);
        packet.totalLength += 11;
      }
      packet.totalLength += packet.subPackets.reduce((s, p) => (s + p.totalLength), 0);
    }

    //console.log(`Generated packet at offset (${idxStart}):`);
    //console.log(binData.substring(idxStart, (idxStart + packet.totalLength)));
    //console.log(packetToBinString(packet));
    return packet;
  } // end - parsePacket()


  const rootPacket = parsePacket(0);

  return rootPacket;
}


function evaluatePacket(packet: Packet): number {
  // Technically, this could be in the switch below,
  // but I prefer to make this base case obvious.
  if (packet.typeID == PacketType.Value) {
    return valuePacketToDec(packet.rawData);
  }

  const subValues = packet.subPackets.map(evaluatePacket);
  let result = 0;

  switch (packet.typeID) {
    case PacketType.Sum:
      console.log(`packet ${packet.offset}: ( ${subValues.join(' + ')} )`);
      result = subValues.reduce((s, i) => (s + i), 0);
      break;
    case PacketType.Product:
      console.log(`packet ${packet.offset}: ( ${subValues.join(' * ')} )`);
      result = subValues.reduce((s, i) => (s * i), 1);
      break;
    case PacketType.Min:
      console.log(`packet ${packet.offset}: MIN[ ${subValues.join(', ')} ]`);
      result = subValues.reduce((min, i) => ((i < min) ? i : min), subValues[0]);
      break;
    case PacketType.Max:
      console.log(`packet ${packet.offset}: MAX[ ${subValues.join(', ')} ]`);
      result = subValues.reduce((max, i) => ((max < i) ? i : max), subValues[0]);
      break;
    case PacketType.GT:
      console.log(`packet ${packet.offset}: ( ${subValues[1]} < ${subValues[0]})`);
      if (subValues[1] < subValues[0]) {
        result = 1;
      } else {
        result = 0;
      }
      break;
    case PacketType.LT:
      console.log(`packet ${packet.offset}: ( ${subValues[0]} < ${subValues[1]})`);
      if (subValues[0] < subValues[1]) {
        result = 1;
      } else {
        result = 0;
      }
      break;
    case PacketType.EQ:
      console.log(`packet ${packet.offset}: ( ${subValues[0]} == ${subValues[1]})`);
      if (subValues[0] == subValues[1]) {
        result = 1;
      } else {
        result = 0;
      }
      break;
  }

  return result;
}


function processSampleData(): void {
  let examplesToProcess: Example[] = Object.values(SAMPLE_DATA);

  if (process.env.LABEL) {
    examplesToProcess = Object.values(SAMPLE_DATA)
      .filter(e => e.label == process.env.LABEL);
  }
  examplesToProcess.forEach(example => {
    console.log('--------');
    console.log(`Processing example transmission ${example.label}`);
    const packet = processTransmission(example.transmission);
    const result = evaluatePacket(packet);
    console.log(`Got (${result})`);
  });
}


function day16_2(): void {
  console.log('Welcome to Day 16.2. Fancy underwater calculator.');

  if (isFull()) {
    const fullPacket = processTransmission(getFullTransmission());
    const result = evaluatePacket(fullPacket);
    console.log(`Full input yielded result: (${result})`);
  } else if (process.env.SOURCE == 'ERIK') {
    const fullPacket = processTransmission(getErikTransmission());
    const result = evaluatePacket(fullPacket);
    console.log(`Erik input yielded result: (${result})`);
  } else {
    processSampleData();
  }

}


day16_2();

