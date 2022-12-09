import styles from "../../styles/Home.module.css";
import Image from "next/image";
export default function HelpHowTo() {
  const showSection = (section_name: string) => {
    let elements = document.getElementsByClassName("how_to_section");
    let hidden_elements = document.getElementsByClassName(
      "how_to_section_hidden"
    );
    for (let element of elements) {
      console.log(element);
      if (element.id != section_name) {
        element.setAttribute("class", "how_to_section_hidden");
      } else {
        element.setAttribute("class", "how_to_section");
      }
    }
    for (let element of hidden_elements) {
      console.log(element);
      if (element.id != section_name) {
        element.setAttribute("class", "how_to_section_hidden");
      } else {
        element.setAttribute("class", "how_to_section");
      }
    }
  };
  return (
    <main className={styles.landing}>
      <section className={styles.show_hide}>
        <a onClick={() => showSection("mileage")}>Mileage How To</a>
        <a onClick={() => showSection("petty_cash")}>Petty Cash How To</a>
        <a onClick={() => showSection("check_request")}>Check Request How To</a>
      </section>
      <section className="how_to_section_hidden" id="mileage">
        <div className="row">
          <p>Mileage Creation</p>
          <Image
            src="/how_to/mileage_create.gif"
            alt="How to Create Mileage"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <article className={styles.instructions}>
          <ol>
            <li>Click new mileage request</li>
            <li>Fill out all the required fields</li>
            <li>
              Ensure your final odometer is greater than the start odometer
            </li>
            <li>Submit the Request</li>
            <li>Check Your Profile and Inbox for Updates</li>
          </ol>
        </article>
        <div className="hr" />
        <div className="row">
          <p>Edit Mileage</p>
          <Image
            src="/how_to/edit_mileage.gif"
            alt="How to Edit Mileage"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <article className={styles.instructions}>
          <ol>
            <li>Search through your active mileage requests</li>
            <li>Click on the desired request</li>
            <li>Click on the Edit Button</li>
            <li>
              Ensure your final odometer is greater than the start odometer
            </li>
            <li>Resubmit the Request</li>
            <li>Check Your Profile and Inbox for Updates</li>
          </ol>
        </article>
        <div className="hr" />
        <div className="row">
          <p>Archive Mileage</p>
          <Image
            src="/how_to/archive_mileage.gif"
            alt="How to Archive Mileage"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <article className={styles.instructions}>
          <ol>
            <li>Search through your active mileage requests</li>
            <li>Click on the desired request</li>
            <li>Click the Archive Button on the Bottom</li>
          </ol>
        </article>
      </section>
      <section className="how_to_section_hidden" id="check_request">
        <div className="row">
          <p>Check Request Creation</p>
          <Image
            src="/how_to/petty_cash_create.gif"
            alt="How to Create Check Request"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <div className={styles.instructions}>
          <ol>
            <li>Click new check request</li>
            <li>Fill out all the required fields</li>
            <li>Attach up to five receipts if needed</li>
            <li>Attach up to five purchases per request</li>
            <li>Submit the Request</li>
            <li>Check Your Profile and Inbox for Updates</li>
          </ol>
        </div>
        <div className="hr" />
        <div className="row">
          <p>Edit Check Request</p>
          <Image
            src="/how_to/edit_check_request.gif"
            alt="How to Edit Check Request"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <article className={styles.instructions}>
          <ol>
            <li>Search through your active check requests</li>
            <li>Click on the desired request</li>
            <li>Click on the Edit Button</li>
            <li>Attach up to five receipts if needed</li>
            <li>Attach up to five purchases per request</li>
            <li>Resubmit the Request</li>
            <li>Check Your Profile and Inbox for Updates</li>
          </ol>
        </article>
        <div className="hr" />
        <div className="row">
          <p>Archive Check Request</p>
          <Image
            src="/how_to/archive_check_request.gif"
            alt="How to Archive Check Request"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <article className={styles.instructions}>
          <ol>
            <li>Search through your active check requests</li>
            <li>Click on the desired request</li>
            <li>Click the Archive Button on the Bottom</li>
          </ol>
        </article>
      </section>
      <section className="how_to_section_hidden" id="petty_cash">
        <div className="row">
          <p>Petty Cash Creation</p>
          <Image
            src="/how_to/check_request_create.gif"
            alt="How to Create Petty Cash"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <article className={styles.instructions}>
          <ol>
            <li>Click new petty cash request</li>
            <li>Fill out all the required fields</li>
            <li>Attach up to five receipts if needed</li>
            <li>Submit the Request</li>
            <li>Check Your Profile and Inbox for Updates</li>
          </ol>
        </article>
        <div className="hr" />
        <div className="row">
          <p>Edit Petty Cash</p>
          <Image
            src="/how_to/petty_cash_update.gif"
            alt="How to Edit Petty Cash"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <article className={styles.instructions}>
          <ol>
            <li>Search through your active petty cash requests</li>
            <li>Click on the desired request</li>
            <li>Click on the Edit Button</li>
            <li>Attach up to five receipts if needed</li>
            <li>Resubmit the Request</li>
            <li>Check Your Profile and Inbox for Updates</li>
          </ol>
        </article>
        <div className="hr" />
        <div className="row">
          <p>Archive Petty Cash</p>
          <Image
            src="/how_to/archive_petty_cash.gif"
            alt="How to Archive Petty Cash"
            height={500}
            width={800}
            layout="fixed"
          />
        </div>
        <article className={styles.instructions}>
          <ol>
            <li>Search through your active petty cash requests</li>
            <li>Click on the desired request</li>
            <li>Click the Archive Button on the Bottom</li>
          </ol>
        </article>
      </section>
    </main>
  );
}
