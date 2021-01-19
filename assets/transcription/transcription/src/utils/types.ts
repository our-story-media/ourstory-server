type Media = {
  inpoint: string,
  outpoint: string,
  path: string,
  event_id: string,
  titletext: string,
  audio: string,
  credits: string,
}
export type Story = {
  _id: string,
  user_id: string,
  createdAt: Date,
  updatedAt: Date,
  media: Media[],
  title: string,
  code: string,
  description: string,
  progress: number,
  shortlink: string,
  path: string,
  transcription: {chunks: Chunk[]},
}

export type Transcription = {
  creatorid: string,
  content: string,
  id: string,
  updatedat: Date,
};

export type Review = {
  reviewedat: Date,
  selectedtranscription: string,
  reviewedby: string,
}

export type Chunk = {
  starttimestamp: string,
  endtimestamp: string,
  starttimeseconds: number,
  endtimeseconds: number,
  creatorid: string,
  updatedat: Date,
  id: string,
  transcriptions: Transcription[],
  review?: Review,
  name?: string
};

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>

export type State<T> = [T, StateSetter<T>];

export type Contribution = {
  name: string,
  for: "chunk" | "transcription" | "review";
  chunk: Chunk,
}