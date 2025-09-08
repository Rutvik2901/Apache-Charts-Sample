import axios from "axios";
import { StatsResponse, YearsResponse } from "./models/Api";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 30000,
});

// Get available years
export const fetchYears = async (): Promise<YearsResponse> => {
    const res = await API.get<YearsResponse>("/users/years");
    return res.data;
};

// Get stats for a given year
export const fetchStatsByYear = async (year: number): Promise<StatsResponse> => {
    const res = await API.get<StatsResponse>(`/users/stats?year=${year}`);
    return res.data;
};