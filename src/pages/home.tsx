import Nav from '../components/nav';
import Ui from '../components/ui';
import Champion from '../components/champions';
import Use from '../components/use';

const Home = () => (
    // The main container for the Home page
    <div className="relative min-h-screen"> 
        
        {/* --- BACKGROUND LAYER ---
            - It covers the whole screen (fixed top-0 left-0 w-full h-full).
            - pointer-events-none ensures you can click through it to interact with the content.
            - z-index: -1 or low value to keep it behind all content.
            - NOTE: For the Swarm component to work correctly, you may need to ensure its internal div's h-screen is respected, 
              or adjust its internal styling to 'absolute inset-0' if you prefer to control size from here.
              In this case, I'll keep the Swarm component untouched as it manages its own full-screen state, 
              but wrap it for separation.
        */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Ui/>
        </div>

        {/* --- FOREGROUND CONTENT LAYER ---
            - All actual content goes here.
            - A low z-index is fine as the background is fixed and has an even lower z-index (0 or less).
        */}
        <div className="relative z-10">
            <Nav />
            <Champion />
            <Use />
        </div>
    </div>
);

export default Home;