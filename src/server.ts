import fastify from "fastify";
import cors from "@fastify/cors";

const server = fastify({
  logger: true,
});

server.register(cors, {
  origin: "*",
});

interface Team {
  id: number;
  name: string;
  base: string;
}

interface Driver {
  id: number;
  name: string;
  team: string;
  number: number;
  country: string;
}

const teams: Team[] = [
  {
    id: 1,
    name: "Red Bull Racing",
    base: "Milton Keynes, United Kingdom",
  },
  {
    id: 2,
    name: "Ferrari",
    base: "Maranello, Italy",
  },
  {
    id: 3,
    name: "Mercedes",
    base: "Brackley, United Kingdom",
  },
  {
    id: 4,
    name: "McLaren",
    base: "Woking, United Kingdom",
  },
  {
    id: 5,
    name: "Aston Martin",
    base: "Silverstone, United Kingdom",
  },
  {
    id: 6,
    name: "Alpine",
    base: "Enstone, United Kingdom",
  },
  {
    id: 7,
    name: "Williams",
    base: "Grove, United Kingdom",
  },
  {
    id: 8,
    name: "Haas",
    base: "Kannapolis, United States",
  },
  {
    id: 9,
    name: "Sauber",
    base: "Hinwil, Switzerland",
  },
  {
    id: 10,
    name: "RB Formula One Team",
    base: "Faenza, Italy",
  },
];

const drivers: Driver[] = [
  {
    id: 1,
    name: "Max Verstappen",
    team: "Red Bull Racing",
    number: 1,
    country: "Netherlands",
  },
  {
    id: 2,
    name: "Sergio Pérez",
    team: "Red Bull Racing",
    number: 11,
    country: "Mexico",
  },
  {
    id: 3,
    name: "Charles Leclerc",
    team: "Ferrari",
    number: 16,
    country: "Monaco",
  },
  {
    id: 4,
    name: "Lewis Hamilton",
    team: "Ferrari",
    number: 44,
    country: "United Kingdom",
  },
  {
    id: 5,
    name: "George Russell",
    team: "Mercedes",
    number: 63,
    country: "United Kingdom",
  },
  {
    id: 6,
    name: "Lando Norris",
    team: "McLaren",
    number: 4,
    country: "United Kingdom",
  },
  {
    id: 7,
    name: "Oscar Piastri",
    team: "McLaren",
    number: 81,
    country: "Australia",
  },
  {
    id: 8,
    name: "Fernando Alonso",
    team: "Aston Martin",
    number: 14,
    country: "Spain",
  },
  {
    id: 9,
    name: "Pierre Gasly",
    team: "Alpine",
    number: 10,
    country: "France",
  },
  {
    id: 10,
    name: "Alexander Albon",
    team: "Williams",
    number: 23,
    country: "Thailand",
  },
  {
    id: 11,
    name: "Kevin Magnussen",
    team: "Haas",
    number: 20,
    country: "Denmark",
  },
  {
    id: 12,
    name: "Valtteri Bottas",
    team: "Sauber",
    number: 77,
    country: "Finland",
  },
];

// =======================
// GET ALL TEAMS
// =======================

server.get("/teams", async (_, response) => {
  response.status(200).send({
    success: true,
    total: teams.length,
    teams,
  });
});

// =======================
// GET TEAM BY ID
// =======================

interface TeamParams {
  id: string;
}

server.get<{ Params: TeamParams }>(
  "/teams/:id",
  async (request, response) => {
    const id = Number(request.params.id);

    const team = teams.find((team) => team.id === id);

    if (!team) {
      return response.status(404).send({
        success: false,
        message: "Team not found",
      });
    }

    return response.status(200).send({
      success: true,
      team,
    });
  }
);

// =======================
// GET ALL DRIVERS
// =======================

server.get("/drivers", async (_, response) => {
  response.status(200).send({
    success: true,
    total: drivers.length,
    drivers,
  });
});

// =======================
// GET DRIVER BY ID
// =======================

interface DriverParams {
  id: string;
}

server.get<{ Params: DriverParams }>(
  "/drivers/:id",
  async (request, response) => {
    const id = Number(request.params.id);

    const driver = drivers.find((driver) => driver.id === id);

    if (!driver) {
      return response.status(404).send({
        success: false,
        message: "Driver not found",
      });
    }

    return response.status(200).send({
      success: true,
      driver,
    });
  }
);

// =======================
// FILTER DRIVERS BY TEAM
// =======================

interface TeamQuery {
  team?: string;
}

server.get<{ Querystring: TeamQuery }>(
  "/drivers/team/search",
  async (request, response) => {
    const teamName = request.query.team;

    if (!teamName) {
      return response.status(400).send({
        success: false,
        message: "Team query is required",
      });
    }

    const filteredDrivers = drivers.filter((driver) =>
      driver.team.toLowerCase().includes(teamName.toLowerCase())
    );

    return response.status(200).send({
      success: true,
      total: filteredDrivers.length,
      drivers: filteredDrivers,
    });
  }
);

// =======================
// SERVER
// =======================

const start = async () => {
  try {
    await server.listen({
      port: 3333,
      host: "0.0.0.0",
    });

    console.log("🚀 Server running on port 3333");
  } catch (error) {
    server.log.error(error);

    process.exit(1);
  }
};

start();
