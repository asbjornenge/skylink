FROM debian:jessie
ADD skylink /usr/bin/skylink
ENTRYPOINT ["skylink","node"]