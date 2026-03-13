import { Composition } from 'remotion';
import { MyComposition, myCompSchema } from './remotion/Composition';
import './index.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DevReel"
        component={MyComposition}
        schema={myCompSchema}
        durationInFrames={300} // 10 seconds of video
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          codeString: `const buildFuture = () => {
  console.log("Hello, Gaza!");
  console.log("Building the next big SaaS...");
  return "Success";
};`,
          language: 'javascript'
        }}
      />
    </>
  );
};
