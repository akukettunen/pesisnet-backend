const axios = require('axios')

const getResultBoard = async ({ seasonId, seasonSeriesId, seasonSeriesPhaseId }) => {
  const resp = await axios(`https://www.pesistulokset.fi/api/v1/result-board?season=${seasonId}&seasonSeries=${seasonSeriesId}&phase=${seasonSeriesPhaseId}`)

  return resp.data
}

const getScoresBoard = async ({ seasonId, seasonSeriesId, seasonSeriesPhaseId }) => {
  const url = `https://www.pesistulokset.fi/api/v1/stats-tool/players?sum=1&season=${seasonId}&seasonSeries=${seasonSeriesId}&phase=${seasonSeriesPhaseId}&statfilter=lyodyt`

  const resp = await axios(url)
  // const resp = await axios(`https://www.pesistulokset.fi/api/v1/result-board?season=${seasonId}&seasonSeries=${seasonSeriesId}&phase=${seasonSeriesPhaseId}`)

  return resp.data
}

const handleResultBoard = board => {
  const sorted_board = board.resultBoard.sort((a, b) => a.num - b.num)

  return {
    title: board.group.name,
    headers: [
      { key: "position", text: "#", long_text: "Sijoitus"  },
      { key: "team", text: "Joukkue", long_text: "Joukkue", lock: true, left: true  },
      { key: "games", text: "O", long_text: "Pelatut ottelut"  },
      { key: "wins", text: "W", long_text: "Voitot"  },
      { key: "losses", text: "L", long_text: "Häviöt"  },
      { key: "draws", text: "T", long_text: "Tasapelit"  },
      { key: "three_point_games", text: "3P", long_text: "Kolmen pisteen voitot"  },
      { key: "two_point_games", text: "2P", long_text: "Kahden pisteen voitot"  },
      { key: "one_point_games", text: "1P", long_text: "Yhden pisteen tappiot"  },
      { key: "zero_point_games", text: "0P", long_text: "Nollan pisteen tappiot"  },
      { key: "run_ratio", text: "J", long_text: "Lyödyt - Päästetyt"  },
      { key: "points", text: "P", long_text: "Pisteet"  },
    ],
    data: sorted_board.map(b => {
      return {
        position: b.num,
        team: b.team.name,
        short_team: b.team.shorthand,
        games: b.stats.matches,
        wins: b.stats.draws,
        draws: b.stats.draws,
        losses: b.stats.losses,
        three_point_games: b.stats['3p'],
        two_point_games: b.stats['2p'],
        one_point_games: b.stats['1p'],
        zero_point_games: b.stats['0p'],
        run_ratio: `${b.stats.runsFor}-${b.stats.runsAgainst}`,
        points: b.stats.points
      }
    })
  }
}

module.exports = { getResultBoard, handleResultBoard, getScoresBoard }