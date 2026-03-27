
# Login
docker login registry.nst.art.br

# Build
docker build -t registry.nst.art.br/vocabulary-app:0.0.5 -f Dockerfile .
docker push registry.nst.art.br/vocabulary-app:0.0.5
