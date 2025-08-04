FROM golang:1.21-alpine AS builder

RUN apk add --no-cache build-base

WORKDIR /app

COPY /app/FullCycleRocks.go .

RUN go build -ldflags="-s -w" -o main FullCycleRocks.go

FROM scratch

COPY --from=builder /app/main /main

ENTRYPOINT ["/main"]
