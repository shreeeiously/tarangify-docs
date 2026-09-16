import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'End-to-End IoT Engineering',
    description: (
      <>
        From electronics and PCB design to firmware, cloud platforms, and
        mobile applications, we bring the complete product stack together.
      </>
    ),
  },
  {
    title: 'Built for Real-World Deployment',
    description: (
      <>
        We don't stop at prototypes. Our products are designed, tested,
        manufactured, and supported for real-world applications.
      </>
    ),
  },
  {
    title: 'Hardware + Software, Together',
    description: (
      <>
        Our hardware and software teams work together throughout development,
        reducing integration problems and accelerating the path from concept
        to production.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureSpace}></div>

      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">

        {/* Feature Cards */}
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>

        {/* IoT Store Section */}
        <div className={styles.storeSection}>
          <h2>Explore Our IoT Solutions</h2>

          <p>
            Discover development boards, IoT hardware, and solutions
            designed to help you build, prototype, and deploy faster.
          </p>

          <a
            href="https://store.thingslinker.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeButton}
          >
            ThingsLinker Store
          </a>
        </div>

      </div>
    </section>
  );
}

