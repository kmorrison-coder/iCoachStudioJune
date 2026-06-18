import { IntegrationTask } from './types';

export const DEFAULT_INTEGRATION_TASKS: IntegrationTask[] = [
  {
    id: 'seed-fraction-intro',
    topic: 'Introductory Fractions on Number Lines',
    gradeLevel: '3rd Grade',
    subject: 'Mathematics',
    ccssId: '3-math-2',
    ccssText: 'CCSS.MATH.3.NF.A.1: Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts.',
    isteStandard: 'ISTE-S.5 (Computational Thinker)',
    status: 'Ready',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    teacherNotes: 'My students often have difficulty visualizing that fractions represent specific locations/distances on a line, not just slices of a pie.',
    aiSuggestion: {
      summary: 'Students explore fractions interactively with GeoGebra without login, and then screen-record themselves physically annotating and narrating fractions on number lines on their iPads.',
      isteStudentStandard: 'Computational Thinker (ISTE-S.5)',
      activity1Name: 'Narrating My iPad Fraction Walk',
      activity1Tool: 'iPad Screen Recording + Markup',
      activity1Description: 'Students take screenshots of blank grids on their iPad, use the built-in Markup pen tools in Photos to shade blocks, draw corresponding number lines, and screen-record themselves explaining how they divided the whole.',
      activity1Steps: [
        'Open a blank drawing canvas in Keynote or Pages on the iPad.',
        'Use the built-in Markup Pencil to draw a straight line from 0 to 1, dividing it into exactly 4 equal partitions.',
        'Turn on iPad Screen Recording from the Control Center.',
        'Record yourself annotating labels for 1/4, 2/4, 3/4, and 4/4 while speaking aloud to explain how you found each point.'
      ],
      activity2Name: 'Interactive Fractions Modeling',
      activity2Tool: 'GeoGebra Fraction Visualizer (Login-Free)',
      activity2Description: 'Students open Safari on their iPad, visit the login-free GeoGebra Fraction Fractions on Number Lines app, and adjust sliders to see partitions shift in real time.',
      activity2Steps: [
        'Open Safari and go to the login-free GeoGebra Fraction Simulator webpage.',
        'Adjust the numerator slider to 3 and denominator slider to 8 to visualize the partition segments.',
        'Take a screenshot of critical slider matches and explain the proportional lengths.',
        'Present the visual model directly to a partner for review.'
      ],
      reflectionPrompt: 'Ask students: "Record a 30-second Voice Memo on your iPad explaining why a denominator of 8 makes smaller portions than a denominator of 2 in your unit whole!"',
      embedHtml: `<div style="font-family: system-ui, -apple-system, sans-serif; background-color: #ffffff; color: #171717; border: 3px solid #f97316; border-radius: 12px; max-width: 600px; margin: 16px auto; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);">
  <!-- Header Block banner -->
  <div style="background-color: #f97316; padding: 16px; border-bottom: 2px solid #ea580c;">
    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.05em;">iPad Tech Integration Blueprint</h3>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #000000; font-weight: 550;">Mathematics: Introductory Fractions on Number Lines</p>
  </div>
  
  <div style="padding: 20px; line-height: 1.5;">
    <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 550; color: #4b5563;">
      🌟 ISTE Standard Alignment: <strong>Computational Thinker (ISTE-S.5)</strong>
    </p>
    
    <div style="background-color: #fffaf0; border-left: 4px solid #f97316; padding: 12px; margin-bottom: 16px; border-radius: 0 6px 6px 0;">
      <h4 style="margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; color: #ea580c; font-weight: 700;">Objective</h4>
      <p style="margin: 0; font-size: 13.5px; color: #374151;">Students explore fractions interactively with GeoGebra without login, and then screen-record themselves physically annotating and narrating fractions on number lines on their iPads.</p>
    </div>

    <!-- Activity 1 -->
    <div style="margin-bottom: 16px; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
      <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #ea580c; font-weight: 700;">Activity 1: iPad Screen Recording + Markup</h4>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #4b5563;">Students draw a straight line from 0 to 1, annotate labels with the built-in Markup pencil, and record their screen explaining their partition segments.</p>
      <div style="font-size: 12px; color: #6b7280; font-family: monospace;">✔️ iPad Built-In Utility: No accounts, no subscriptions!</div>
    </div>

    <!-- Activity 2 -->
    <div style="margin-bottom: 16px; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
      <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #ea580c; font-weight: 700;">Activity 2: GeoGebra Fraction Simulator</h4>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #4b5563;">Students access the free fractions model on Safari, tweak segments dynamically, and capture proportional snapshots.</p>
      <div style="font-size: 12px; color: #6b7280; font-family: monospace;">✔️ Login-Free Academic Web Access</div>
    </div>
    
    <!-- Reflection -->
    <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #f3f4f6;">
      <h5 style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Student Classroom Reflection</h5>
      <p style="margin: 0; font-size: 13px; color: #374151; font-style: italic;">"Record a 30-second Voice Memo on your iPad explaining why a denominator of 8 makes smaller portions than a denominator of 2."</p>
    </div>
  </div>
</div>`
    }
  },
  {
    id: 'seed-water-cycle',
    topic: 'The Water Cycle Evaporation Experiments',
    gradeLevel: '2nd Grade',
    subject: 'Science',
    ccssId: '2-ela-1',
    ccssText: 'CCSS.ELA-LITERACY.RI.2.3: Describe the connection between a series of historical events, scientific ideas or concepts, or steps in technical procedures.',
    isteStandard: 'ISTE-S.6 (Creative Communicator)',
    status: 'Completed',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
    teacherNotes: 'Teaching condensation/evaporation practically using ziplock windows, but students struggle to tell the story of water in a linear step-by-step procedure.',
    aiSuggestion: {
      summary: 'Students capture time-lapse photos of condensation on ziplock bags using the iPad Camera app, then voiceover narrate the sequence in a beautiful iPad Clips movie.',
      isteStudentStandard: 'Creative Communicator (ISTE-S.6)',
      activity1Name: 'Flipping the Script: Story of water drops',
      activity1Tool: 'iPad Camera (Time-lapse/Video) + Pages',
      activity1Description: 'Students use iPad Camera Tripods / table mounts to film a 5-minute time-lapse of water drops warming up on plastic bags. They drop these video clips into Pages layout templates to label condensation stages.',
      activity1Steps: [
        'Tape a plastic ziplock experiment bag with wet soil onto a sunny window.',
        'Anchor your iPad and set the Camera slider selection to Time-Lapse.',
        'Record water droplets gathering as heat rises for up to 5 minutes.',
        'Import the generated video into a Pages science log, and label the Phase Shifts.'
      ],
      activity2Name: 'Dynamic Hydrologic Cycles Study',
      activity2Tool: 'USGS Interactive Water Diagrams (No Login)',
      activity2Description: 'Students access free interactive climate cycle maps published by trusted international science organizations. They circle, zoom, and screenshot condensation points directly using iPad Markup.',
      activity2Steps: [
        'Open Safari and direct to the reputable login-free interactive water diagram.',
        'Locate the "Evaporation" node and toggle interactive flow arrows.',
        'Press iPad Power + Volume Up to trigger a web-page Screenshot.',
        'Activate Markup mode at the bottom left, draw an orange arrow tracing transpiration, and save directly to Photos.'
      ],
      reflectionPrompt: 'Ask students: "Record a 2-sentence voice-note in Pages explaining how solar energy powers evaporation!"',
      embedHtml: `<div style="font-family: system-ui, -apple-system, sans-serif; background-color: #ffffff; color: #171717; border: 3px solid #f97316; border-radius: 12px; max-width: 600px; margin: 16px auto; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);">
  <!-- Header Block banner -->
  <div style="background-color: #f97316; padding: 16px; border-bottom: 2px solid #ea580c;">
    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.05em;">iPad Tech Integration Blueprint</h3>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #000000; font-weight: 550;">Science: The Water Cycle Evaporation Experiments</p>
  </div>
  
  <div style="padding: 20px; line-height: 1.5;">
    <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 550; color: #4b5563;">
      🌟 ISTE Standard Alignment: <strong>Creative Communicator (ISTE-S.6)</strong>
    </p>
    
    <div style="background-color: #fffaf0; border-left: 4px solid #f97316; padding: 12px; margin-bottom: 16px; border-radius: 0 6px 6px 0;">
      <h4 style="margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; color: #ea580c; font-weight: 700;">Objective</h4>
      <p style="margin: 0; font-size: 13.5px; color: #374151;">Students capture time-lapse photos of condensation on ziplock bags using the iPad Camera app, then voiceover narrate the sequence in a beautiful iPad Clips movie.</p>
    </div>

    <!-- Activity 1 -->
    <div style="margin-bottom: 16px; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
      <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #ea580c; font-weight: 700;">Activity 1: iPad Camera Time-Lapse + Pages</h4>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #4b5563;">Record droplets gathering on sunny windows using native camera time-lapse and embed into Pages science logbooks.</p>
      <div style="font-size: 12px; color: #6b7280; font-family: monospace;">✔️ iPad Built-In Utility</div>
    </div>

    <!-- Activity 2 -->
    <div style="margin-bottom: 16px; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
      <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #ea580c; font-weight: 700;">Activity 2: USGS Interactive Diagram + Markup</h4>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #4b5563;">Explore trusted interactive climate diagrams on Safari, screenshot, and write directly onto the web graphics using standard drawing Markup tools.</p>
      <div style="font-size: 12px; color: #6b7280; font-family: monospace;">✔️ Login-Free Web Tool</div>
    </div>
    
    <!-- Reflection -->
    <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #f3f4f6;">
      <h5 style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Student Classroom Reflection</h5>
      <p style="margin: 0; font-size: 13px; color: #374151; font-style: italic;">"Record a 2-sentence voice-note in Pages explaining how solar energy powers evaporation!"</p>
    </div>
  </div>
</div>`
    }
  }
];
