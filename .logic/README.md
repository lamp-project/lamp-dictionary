

## Requiremnets

1. [Wordnet AS A Service](https://hub.docker.com/r/jacopofar/wordnet-as-a-service):
    This application exposes a few WordNet functions with a simple REST interface. In particular, can be used from a browser or as a text annotator.

    ```
    docker run -d -p 5679:5679 jacopofar/wordnet-as-a-service
    ```