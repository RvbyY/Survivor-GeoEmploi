FROM golang:1.26-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:3.22

WORKDIR /app
COPY --from=builder /app/server ./server

RUN adduser -D appuser && chown appuser:appuser ./server
USER appuser

EXPOSE 8080
CMD ["./server"]
