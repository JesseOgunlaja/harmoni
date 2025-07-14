import styles from "@/styles/home.module.css";
import { ArrowRight, Focus, Target, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main id={styles.main}>
      <section>
        <h1 id={styles.slogan}>
          Cut the clutter, <br /> Boost the output
        </h1>
        <p id={styles.description}>
          A sleek, intuitive tool crafted to simplify your workflow, eliminate
          distractions, and maximize your productivity every step of the way.
        </p>
        <Link id={styles.getStarted} href="/signin">
          Get started now <ArrowRight />
        </Link>
        <p>Free Forever and no credit card required.</p>
      </section>
      <section>
        <h2>Built for focus</h2>
        <p>
          Every feature designed to help you stay in the zone and get more done.
        </p>
        <div>
          <article>
            <Focus />
            <p>Distraction free</p>
            <p>
              Clean interface that eliminates visual noise and keeps you focused
              on what matters most.
            </p>
          </article>
          <article>
            <Zap />
            <p>Lightning Fast</p>
            <p>
              Optimized for speed with instant loading and seamless interactions
              across all browsers
            </p>
          </article>
          <article>
            <Target />
            <p>Goal Oriented</p>
            <p>
              Smart workflows that adapt to your goals and help you achieve them
              more efficiently.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
