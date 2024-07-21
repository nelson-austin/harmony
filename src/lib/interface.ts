export interface User {
    id?: string;
    name: string;
    email: string;
    image: string;
}

export interface Playlist {
    id: string;
    playlist_name: string;
    provider: string;
    info: string;
}

export interface Track {
    name: string;
    artists: [{
        name: string;
    }];
    album: {
        images: [{
            url: string;
        }]
    }
}

export interface Song {
    track: {
        name: string;
        album: {
            images: [{
                url: string,
                width: number,
                height: number,
            }]
        }
    }
    
}

export interface Anthem {
    name: string;
    artist: string;
    image: string;
}

export type State = {
    errors?: {
      name?: string[];
      description?: string[];
    };
    message?: string | null;
};

export interface Friend {
    id: string;
    name: string;
}