// lib/contractGenerator.js

export function generateContractText({ employee, employer, contractType, signedDate }) {
  const isTeilzeit = contractType === 'TEILZEIT';

  // Reglas obtenidas de 'tipos de contrato.xlsx'
  const config = isTeilzeit
    ? {
        title: 'TEILZEIT — 30 Stunden/Woche',
        hours: 30,
        days: 'Montag bis Freitag',
        scheduleText: 'Die tägliche Arbeitszeit beträgt in der Regel 6 Stunden (06:00-10:00 und 15:00-17:00).',
        rufbereitschaftText: 'Außerhalb der in § 3 geregelten Arbeitszeiten kann der Arbeitnehmer freiwillig Rufbereitschaft leisten.',
        vacationDays: '20 Arbeitstage',
      }
    : {
        title: 'MINIJOB — 4 Stunden/Woche',
        hours: 4,
        days: 'Freitags und Samstags',
        scheduleText: 'Die regelmäßige Arbeitszeit wird freitags und samstags jeweils von 19:00 Uhr bis 21:00 Uhr geleistet.',
        rufbereitschaftText: 'Freiwillige Rufbereitschaft im Umfang von bis zu 6 Stunden pro Woche.',
        vacationDays: 'nach Maßgabe des Bundesurlaubsgesetzes (anteilig)',
      };

  return `
ARBEITSVERTRAG (${config.title})

Zwischen
${employer.name}, ${employer.address}
— nachfolgend „Arbeitgeber“ genannt —

und
${employee.lastName}, ${employee.firstName}
geboren am ${employee.birthDate || 'N/A'}
wohnhaft ${employee.address || ''}, ${employee.zipCode || ''} ${employee.city || ''}
— nachfolgend „Arbeitnehmer“ genannt —

wird folgender Arbeitsvertrag geschlossen:

§ 1 Beginn und Dauer des Arbeitsverhältnisses
(1) Das Arbeitsverhältnis beginnt am ${employee.startDate || 'N/A'}.
(2) Die ersten 6 Monate gelten als Probezeit mit einer Kündigungsfrist von zwei Wochen.

§ 2 Tätigkeit
(1) Der Arbeitnehmer wird als Fahrer im Mietwagengewerbe gemäß § 49 PBefG eingestellt.
(2) Rückkehrpflicht gemäß § 49 Abs. 4 PBefG ist strikt einzuhalten.

§ 3 Arbeitszeit
(1) Die regelmäßige wöchentliche Arbeitszeit beträgt ${config.hours} Stunden, verteilt auf ${config.days}.
(2) ${config.scheduleText}

§ 4 Rufbereitschaft
(1) ${config.rufbereitschaftText}

§ 5 Vergütung
(1) 40% des Nettofahrtentgelts. Mindestlohngarantie nach gesetzlichem Stundensatz.

Edingen-Neckarhausen, den ${signedDate || new Date().toLocaleDateString('de-DE')}

________________________               ________________________
Arbeitgeber                            Arbeitnehmer
${employer.name}                       ${employee.firstName} ${employee.lastName}
  `.trim();
}