export type RoundInfo = {
  roundId?: string;
  startsIn: number;
  duration: number;
  sentence: string;
};

export type StartRoundRequest = {
  type: "startRound";
  channelName: string;
};

export type StartRoundSuccessResponse = {
  message: string;
  round: RoundInfo;
};

export type StartRoundErrorResponse = {
  error: string;
};

export type StartRoundResponse = StartRoundSuccessResponse | StartRoundErrorResponse;

export type RoundStartBroadcastPayload = {
  roundId: string;
  sentence: string;
  startsIn: number;
  duration: number;
};

export type RoundStartBroadcastMessage = {
  type: "broadcast";
  event: "round_start";
  payload: RoundStartBroadcastPayload;
};

export type RoundProgressBroadcastPayload = {
  playerId: string;
  playerName: string;
  typed: string;
};

export type RoundProgressBroadcastMessage = {
  type: "broadcast";
  event: "round_progress";
  payload: RoundProgressBroadcastPayload;
};
