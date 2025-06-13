import { createServer } from "miragejs"
import { MAP_POINTS, TRACK_LIST } from "./data"

export function makeServer({ environment = "development" } = {}) {
    return createServer({
        environment,
        routes() {
            // Set a base URL prefix if your API has one
            this.urlPrefix = "http://localhost:8080" // Assuming your app runs on 3000 and the API is /api
            this.namespace = "/api"
            this.timing = 4000

            // GET /api/playlist
            this.get("/playlist", () => {
                return TRACK_LIST
            })

            // GET /api/map/:id
            this.get("/map/:id", () => {
                return MAP_POINTS
            })
        },
    })
}
