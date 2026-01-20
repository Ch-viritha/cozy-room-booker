import { Room, BookingResult } from "@/types/hotel";

// Initialize all 97 rooms
export function initializeRooms(): Room[] {
  const rooms: Room[] = [];
  
  // Floors 1-9: 10 rooms each (101-110, 201-210, etc.)
  for (let floor = 1; floor <= 9; floor++) {
    for (let room = 1; room <= 10; room++) {
      const roomNumber = floor * 100 + room;
      rooms.push({
        id: roomNumber,
        floor,
        roomNumber,
        isBooked: false,
      });
    }
  }
  
  // Floor 10: 7 rooms (1001-1007)
  for (let room = 1; room <= 7; room++) {
    const roomNumber = 1000 + room;
    rooms.push({
      id: roomNumber,
      floor: 10,
      roomNumber,
      isBooked: false,
    });
  }
  
  return rooms;
}

// Get room position (1-10 for floors 1-9, 1-7 for floor 10)
function getRoomPosition(roomNumber: number): number {
  if (roomNumber >= 1001) {
    return roomNumber - 1000;
  }
  return roomNumber % 100;
}

// Calculate travel time between two rooms
export function calculateTravelTime(room1: number, room2: number): number {
  const floor1 = room1 >= 1000 ? 10 : Math.floor(room1 / 100);
  const floor2 = room2 >= 1000 ? 10 : Math.floor(room2 / 100);
  const pos1 = getRoomPosition(room1);
  const pos2 = getRoomPosition(room2);
  
  const verticalTime = Math.abs(floor2 - floor1) * 2;
  const horizontalTime = Math.abs(pos2 - pos1);
  
  return verticalTime + horizontalTime;
}

// Calculate total travel time for a set of rooms (from first to last)
function calculateTotalTravelTime(rooms: number[]): number {
  if (rooms.length <= 1) return 0;
  
  // Sort rooms to find logical travel path
  const sorted = [...rooms].sort((a, b) => {
    const floorA = a >= 1000 ? 10 : Math.floor(a / 100);
    const floorB = b >= 1000 ? 10 : Math.floor(b / 100);
    if (floorA !== floorB) return floorA - floorB;
    return getRoomPosition(a) - getRoomPosition(b);
  });
  
  let total = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    total += calculateTravelTime(sorted[i], sorted[i + 1]);
  }
  return total;
}

// Get available rooms on a specific floor
function getAvailableRoomsOnFloor(rooms: Room[], floor: number): number[] {
  return rooms
    .filter(r => r.floor === floor && !r.isBooked)
    .map(r => r.roomNumber);
}

// Find best consecutive or closest rooms on a floor
function findBestRoomsOnFloor(availableRooms: number[], count: number): number[] {
  if (availableRooms.length < count) return [];
  
  const positions = availableRooms.map(r => ({
    room: r,
    pos: getRoomPosition(r)
  })).sort((a, b) => a.pos - b.pos);
  
  let bestCombination: number[] = [];
  let bestSpread = Infinity;
  
  // Try all combinations and find the one with minimum spread
  for (let i = 0; i <= positions.length - count; i++) {
    const combination = positions.slice(i, i + count).map(p => p.room);
    const spread = positions[i + count - 1].pos - positions[i].pos;
    if (spread < bestSpread) {
      bestSpread = spread;
      bestCombination = combination;
    }
  }
  
  return bestCombination;
}

// Generate all combinations of size k from an array
function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  
  const result: T[][] = [];
  
  function backtrack(start: number, current: T[]) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  
  backtrack(0, []);
  return result;
}

// Find optimal rooms across multiple floors
function findOptimalRoomsAcrossFloors(rooms: Room[], count: number): number[] {
  const allAvailable = rooms.filter(r => !r.isBooked).map(r => r.roomNumber);
  
  if (allAvailable.length < count) return [];
  
  // For small counts, we can check all combinations
  if (allAvailable.length <= 20 || count <= 3) {
    const combinations = getCombinations(allAvailable, count);
    let bestCombination: number[] = [];
    let bestTravelTime = Infinity;
    
    for (const combo of combinations) {
      const travelTime = calculateTotalTravelTime(combo);
      if (travelTime < bestTravelTime) {
        bestTravelTime = travelTime;
        bestCombination = combo;
      }
    }
    
    return bestCombination;
  }
  
  // For larger sets, use a greedy approach
  // Start from lowest floor and find closest available rooms
  const sorted = allAvailable.sort((a, b) => {
    const floorA = a >= 1000 ? 10 : Math.floor(a / 100);
    const floorB = b >= 1000 ? 10 : Math.floor(b / 100);
    if (floorA !== floorB) return floorA - floorB;
    return getRoomPosition(a) - getRoomPosition(b);
  });
  
  let bestResult: number[] = [];
  let bestTime = Infinity;
  
  // Try starting from each available room
  for (let startIdx = 0; startIdx <= sorted.length - count; startIdx++) {
    const candidate = sorted.slice(startIdx, startIdx + count);
    const time = calculateTotalTravelTime(candidate);
    if (time < bestTime) {
      bestTime = time;
      bestResult = candidate;
    }
  }
  
  return bestResult;
}

// Main booking function
export function bookRooms(rooms: Room[], requestedCount: number): BookingResult {
  if (requestedCount < 1 || requestedCount > 5) {
    return {
      rooms: [],
      travelTime: 0,
      success: false,
      message: "You can book between 1 and 5 rooms only."
    };
  }
  
  const availableCount = rooms.filter(r => !r.isBooked).length;
  if (availableCount < requestedCount) {
    return {
      rooms: [],
      travelTime: 0,
      success: false,
      message: `Only ${availableCount} rooms available. Cannot book ${requestedCount} rooms.`
    };
  }
  
  // Priority 1: Try to find rooms on the same floor
  for (let floor = 1; floor <= 10; floor++) {
    const availableOnFloor = getAvailableRoomsOnFloor(rooms, floor);
    if (availableOnFloor.length >= requestedCount) {
      const bestRooms = findBestRoomsOnFloor(availableOnFloor, requestedCount);
      if (bestRooms.length === requestedCount) {
        return {
          rooms: bestRooms,
          travelTime: calculateTotalTravelTime(bestRooms),
          success: true,
          message: `Booked ${requestedCount} room(s) on Floor ${floor}`
        };
      }
    }
  }
  
  // Priority 2: Find optimal rooms across floors
  const optimalRooms = findOptimalRoomsAcrossFloors(rooms, requestedCount);
  if (optimalRooms.length === requestedCount) {
    const floors = [...new Set(optimalRooms.map(r => r >= 1000 ? 10 : Math.floor(r / 100)))];
    return {
      rooms: optimalRooms,
      travelTime: calculateTotalTravelTime(optimalRooms),
      success: true,
      message: `Booked ${requestedCount} room(s) across Floor(s) ${floors.join(', ')}`
    };
  }
  
  return {
    rooms: [],
    travelTime: 0,
    success: false,
    message: "Unable to find suitable rooms."
  };
}

// Generate random occupancy
export function generateRandomOccupancy(rooms: Room[], occupancyRate: number = 0.5): Room[] {
  return rooms.map(room => ({
    ...room,
    isBooked: Math.random() < occupancyRate
  }));
}

// Reset all bookings
export function resetAllBookings(rooms: Room[]): Room[] {
  return rooms.map(room => ({
    ...room,
    isBooked: false
  }));
}

// Apply booking to rooms
export function applyBooking(rooms: Room[], bookedRoomNumbers: number[]): Room[] {
  return rooms.map(room => ({
    ...room,
    isBooked: room.isBooked || bookedRoomNumbers.includes(room.roomNumber)
  }));
}
