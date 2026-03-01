export type RoundInfo = {
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
