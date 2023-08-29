declare module 'filereader-stream' {
    import { Readable } from 'stream';

    interface FileReaderStreamOptions {
        // Define the options if needed
    }

    function createFileStream(
        file: File,
        options?: FileReaderStreamOptions
    ): Readable;

    export = createFileStream;
}
