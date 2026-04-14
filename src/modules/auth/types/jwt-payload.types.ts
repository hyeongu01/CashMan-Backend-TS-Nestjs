export type JwtPayload = {
  id: string;
};

export type JwtRefreshPayload = JwtPayload & { deviceId: string };
