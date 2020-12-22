
export type Transcription = {
  creatorid: string,
  content: string,
  id: string,
  updatedat: Date,
};

export type Chunk = {
  starttimestamp: string,
  endtimestamp: string,
  starttimeseconds: number,
  endtimeseconds: number,
  creatorid: string,
  updatedat: Date,
  id: string,
  transcriptions: Transcription[],
};

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>