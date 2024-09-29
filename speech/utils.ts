import { LOCAL_IP_PATTERN } from "./constants";

export const isLocalNetworkUrl = (url: string): boolean => {
  return LOCAL_IP_PATTERN.test(url);
};

export const convertToLinuxPath = (windowsPath: string): string => {
  // Replace the drive letter (e.g., D:) with `/mnt/d/`
  const linuxPath = windowsPath.replace(/^[a-zA-Z]:/, (match) => {
    return `/mnt/${match[0].toLowerCase()}`;
  });

  // Replace backslashes with forward slashes
  return linuxPath.replace(/\\/g, "/");
};
