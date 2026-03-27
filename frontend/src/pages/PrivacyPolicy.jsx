import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '40px 32px', border: '1px solid #e2e8f0' }}>
        
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Informativa sul Trattamento dei Dati Personali
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '32px', fontStyle: 'italic' }}>
          ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR) — Iscrizione all'evento "Ethera Future Talks"
        </p>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px' }}>
          <p style={{ fontWeight: 700, color: '#166534', marginBottom: '12px', fontSize: '0.95rem' }}>
            In parole semplici — per gli studenti più giovani
          </p>
          <p style={{ color: '#15803d', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Per iscriverti all'evento "Ethera Future Talks" ti chiediamo alcune informazioni su di te: il tuo nome, cognome, età, città, email, la scuola che frequenti e la tua classe. 
            Queste informazioni ci servono solo per organizzare l'evento e per inviarti eventuali comunicazioni su di esso (ad esempio, conferma dell'iscrizione o variazioni di programma).
          </p>
          <p style={{ color: '#15803d', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '8px' }}>
            Non daremo i tuoi dati a nessun altro e li cancelleremo entro 30 giorni dalla fine dell'evento. 
            Puoi chiederci in qualsiasi momento di cancellare i tuoi dati scrivendoci a <strong>legal@pec.etheraculture.com</strong>.
          </p>
          <p style={{ color: '#15803d', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '8px' }}>
            Se hai meno di 14 anni, chiedi a un genitore o a chi si prende cura di te di leggere questa pagina e di autorizzare la tua iscrizione.
          </p>
        </div>

        <Section title="1. Titolare del Trattamento">
          <p>Il Titolare del trattamento dei dati personali è <strong>Ethera Culture APS</strong> (di seguito "Titolare" o "Associazione"), con sede in C.da Pozzo Schettino, snc — 70038 Terlizzi (BA), contattabile ai seguenti recapiti:</p>
          <ul>
            <li><strong>PEC:</strong> legal@pec.etheraculture.com</li>
            <li><strong>Sito web:</strong> www.etheraculture.com</li>
          </ul>
          <p>L'Associazione non ha nominato un Responsabile della Protezione dei Dati (DPO) in quanto non ricorrono le condizioni di cui all'art. 37 del GDPR. Per qualsiasi richiesta relativa al trattamento dei dati personali, è possibile contattare il Titolare ai recapiti sopra indicati.</p>
        </Section>

        <Section title="2. Finalità e base giuridica del trattamento">
          <p>I dati personali raccolti attraverso il modulo di iscrizione all'evento "Ethera Future Talks", che si terrà presso la Cittadella degli Artisti di Molfetta, sono trattati per le seguenti finalità:</p>
          <ul>
            <li><strong>a) Gestione dell'iscrizione e partecipazione all'evento</strong>: registrazione, verifica dell'accreditamento, organizzazione logistica e gestione della lista presenze. <em>Base giuridica</em>: esecuzione di misure precontrattuali su richiesta dell'interessato (art. 6, par. 1, lett. b, GDPR).</li>
            <li><strong>b) Invio di comunicazioni relative all'evento</strong>: conferma dell'iscrizione, promemoria, aggiornamenti logistici e eventuali variazioni di programma. <em>Base giuridica</em>: legittimo interesse del Titolare a garantire la corretta organizzazione e comunicazione dell'evento (art. 6, par. 1, lett. f, GDPR).</li>
            <li><strong>c) Adempimento di obblighi di legge</strong>: eventuali obblighi normativi connessi alla sicurezza dei partecipanti e alla gestione dell'evento. <em>Base giuridica</em>: adempimento di un obbligo legale al quale è soggetto il Titolare (art. 6, par. 1, lett. c, GDPR).</li>
          </ul>
        </Section>

        <Section title="3. Categorie di dati personali raccolti">
          <p>Attraverso il modulo di iscrizione vengono raccolti i seguenti dati:</p>
          <ul>
            <li>Nome e cognome</li>
            <li>Età</li>
            <li>Città di residenza</li>
            <li>Indirizzo e-mail</li>
            <li>Scuola di provenienza e classe frequentata</li>
            <li>Eventuale ruolo di Rappresentante d'Istituto</li>
          </ul>
          <p>I dati relativi all'età sono raccolti esclusivamente per finalità organizzative e logistiche connesse all'evento. <strong>Non vengono raccolti dati appartenenti a categorie particolari</strong> (dati sensibili) ai sensi dell'art. 9 del GDPR.</p>
        </Section>

        <Section title="4. Natura del conferimento e conseguenze del rifiuto">
          <p>Il conferimento dei dati personali è <strong>facoltativo</strong>. Tuttavia, il mancato conferimento dei dati contrassegnati come obbligatori nel modulo di iscrizione (nome, cognome, età, città, e-mail, scuola e classe) comporterà l'<strong>impossibilità di completare l'iscrizione</strong> e, pertanto, di partecipare all'evento.</p>
        </Section>

        <Section title="5. Destinatari dei dati">
          <p>I dati personali raccolti sono accessibili esclusivamente al <strong>personale autorizzato dell'Associazione</strong>, debitamente istruito ai sensi dell'art. 29 del GDPR e dell'art. 2-quaterdecies del D.Lgs. 196/2003, limitatamente a quanto strettamente necessario per l'organizzazione dell'evento.</p>
          <p>I dati personali <strong>non sono comunicati a soggetti terzi</strong>, né diffusi, salvo che la comunicazione sia necessaria per adempiere a obblighi di legge o su richiesta dell'autorità giudiziaria.</p>
        </Section>

        <Section title="6. Trattamento dei dati di minori">
          <p>L'evento è rivolto a studenti che possono essere sia maggiorenni sia minorenni. L'iscrizione avviene tramite un link diffuso attraverso la <strong>circolare scolastica</strong> dell'istituto di appartenenza, nell'ambito di un'attività di carattere educativo e culturale.</p>
          <p>Le basi giuridiche del trattamento, come indicato alla sezione 2, sono l'esecuzione di misure precontrattuali (art. 6, par. 1, lett. b, GDPR), il legittimo interesse (art. 6, par. 1, lett. f, GDPR) e l'adempimento di obblighi di legge (art. 6, par. 1, lett. c, GDPR). Il trattamento non è pertanto fondato sul consenso dell'interessato ai sensi dell'art. 6, par. 1, lett. a, GDPR.</p>
          <p>Ciò nonostante, in conformità al principio di trasparenza e di tutela rafforzata dei minori previsto dal GDPR (Considerando n. 38 e n. 58) e tenendo conto dell'art. 2-quinquies del D.Lgs. 196/2003 (come modificato dal D.Lgs. 101/2018), che fissa a <strong>14 anni</strong> l'età per l'espressione autonoma del consenso in relazione ai servizi della società dell'informazione, il Titolare adotta le seguenti cautele:</p>
          <ul>
            <li>per gli studenti di età pari o superiore a 14 anni, l'iscrizione può essere effettuata autonomamente;</li>
            <li>per gli studenti di età inferiore a 14 anni, si richiede che l'iscrizione avvenga con la consapevolezza e l'approvazione di chi esercita la responsabilità genitoriale.</li>
          </ul>
          <p>Considerato che l'iscrizione è veicolata dall'istituto scolastico tramite circolare ufficiale, il Titolare confida che la partecipazione dei minori avvenga con la consapevolezza e l'approvazione dei genitori o tutori. Il Titolare si riserva il diritto di verificare il consenso genitoriale ove necessario e di cancellare i dati raccolti in assenza di idonea autorizzazione.</p>
          <p>Ai sensi dell'art. 12 del GDPR e del Considerando n. 58, la presente informativa è integrata con un riquadro introduttivo redatto in linguaggio semplice e chiaro, specificamente pensato per essere comprensibile dai partecipanti più giovani.</p>
        </Section>

        <Section title="7. Modalità del trattamento">
          <p>I dati personali sono trattati con strumenti elettronici, nel rispetto delle misure di sicurezza previste dal GDPR (art. 32), e sono conservati su <strong>server situati nell'Unione Europea (Germania)</strong>, gestiti dal Titolare. Il trattamento è effettuato con modalità idonee a garantire la sicurezza, l'integrità e la riservatezza dei dati, adottando misure tecniche e organizzative adeguate al rischio.</p>
        </Section>

        <Section title="8. Periodo di conservazione">
          <p>I dati personali raccolti saranno conservati per il tempo strettamente necessario al perseguimento delle finalità sopra indicate e, in ogni caso, saranno <strong>cancellati entro 30 (trenta) giorni</strong> dalla data di conclusione dell'evento, salvo obblighi di legge che ne impongano una conservazione più prolungata.</p>
        </Section>

        <Section title="9. Trasferimento dei dati">
          <p>I dati personali <strong>non sono trasferiti al di fuori dell'Unione Europea</strong> né verso organizzazioni internazionali. I server utilizzati per la conservazione dei dati sono ubicati in Germania (UE).</p>
        </Section>

        <Section title="10. Processi decisionali automatizzati">
          <p>Il Titolare <strong>non adotta processi decisionali automatizzati</strong>, ivi compresa la profilazione, di cui all'art. 22, paragrafi 1 e 4, del GDPR.</p>
        </Section>

        <Section title="11. Diritti dell'interessato">
          <p>In qualità di interessato, ai sensi degli artt. 15-22 del GDPR, è possibile esercitare in qualsiasi momento i seguenti diritti:</p>
          <ul>
            <li><strong>Diritto di accesso</strong> (art. 15): ottenere conferma dell'esistenza di un trattamento e accedere ai propri dati personali;</li>
            <li><strong>Diritto di rettifica</strong> (art. 16): ottenere la correzione di dati inesatti o l'integrazione di dati incompleti;</li>
            <li><strong>Diritto alla cancellazione</strong> (art. 17): ottenere la cancellazione dei propri dati, ove sussistano le condizioni previste dalla legge;</li>
            <li><strong>Diritto di limitazione del trattamento</strong> (art. 18): ottenere la limitazione del trattamento nei casi previsti dalla normativa;</li>
            <li><strong>Diritto alla portabilità dei dati</strong> (art. 20): ricevere i propri dati in formato strutturato, di uso comune e leggibile da dispositivo automatico;</li>
            <li><strong>Diritto di opposizione</strong> (art. 21): opporsi al trattamento fondato sul legittimo interesse del Titolare, per motivi connessi alla propria situazione particolare.</li>
          </ul>
          <p>Per esercitare i propri diritti, è possibile contattare il Titolare scrivendo a: <strong>legal@pec.etheraculture.com</strong>. Il Titolare risponderà alla richiesta senza ingiustificato ritardo e, in ogni caso, entro un mese dal ricevimento della stessa, come previsto dall'art. 12 del GDPR.</p>
          <p>È inoltre riconosciuto il diritto di proporre reclamo all'<strong>Autorità Garante per la Protezione dei Dati Personali</strong> (www.garanteprivacy.it), qualora si ritenga che il trattamento dei propri dati avvenga in violazione del GDPR.</p>
        </Section>

        <Section title="12. Cookie e tracciamento">
          <p>Il sito web utilizzato per la raccolta delle iscrizioni <strong>non utilizza cookie di profilazione o di tracciamento</strong>. Possono essere utilizzati esclusivamente cookie tecnici strettamente necessari al funzionamento del sito, che non richiedono il consenso dell'utente ai sensi dell'art. 122 del D.Lgs. 196/2003.</p>
        </Section>

        <Section title="13. Modifiche alla presente informativa">
          <p>Il Titolare si riserva il diritto di modificare o aggiornare la presente informativa in qualsiasi momento. Eventuali modifiche sostanziali saranno rese note attraverso il sito web dell'Associazione. Si invita a consultare periodicamente la presente pagina per prendere visione dell'informativa più aggiornata.</p>
        </Section>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>Ultimo aggiornamento: marzo 2026</p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>Ethera Culture APS</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>{title}</h2>
      <div style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.75 }}>
        {React.Children.map(children, child => child)}
      </div>
    </div>
  );
}
