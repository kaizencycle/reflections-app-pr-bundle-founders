FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY . .
EXPOSE 8081

# Environment variables (set at runtime)
ENV MCP_SERVER_URL=""
ENV BRIDGE_TOKEN=""

CMD ["npm", "start"]
