import axios from 'axios';
import { BusStop } from '../types/interfaces';

const API_BASE_URL = 'http://localhost:3000';

export class BusService {
  private static instance: BusService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): BusService {
    if (!BusService.instance) {
      BusService.instance = new BusService();
    }
    return BusService.instance;
  }

  async getAllStops(): Promise<BusStop[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stops`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch stops');
    }
  }

  async getStopsByLine(lineId: number): Promise<BusStop[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stops`);
      return response.data.filter((stop: BusStop) => stop.line === lineId);
    } catch (error) {
      throw new Error('Failed to fetch bus stops');
    }
  }

  async getTimesByLineAndStop(lineId: number, stopId: number): Promise<BusStop[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/stops`);
      return response.data.filter(
        (stop: BusStop) => stop.line === lineId && stop.id === stopId
      );
    } catch (error) {
      throw new Error('Failed to fetch times');
    }
  }
}

export const busService = BusService.getInstance(); 