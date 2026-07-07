import CallToAction from "../components/heroComponent/CallToAction";
import Features from "../components/heroComponent/Features";
import Hero from "../components/heroComponent/Hero";


export default function FixFlow(){

    return(
        <div className="mt-8">
        <Hero/>
      {/* <Stats/> */}
      <Features/>
      <CallToAction/>
      </div>
    )
}
