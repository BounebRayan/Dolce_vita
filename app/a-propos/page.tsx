

export default function Page() {
  return (
    <section className="about-page bg-white text-gray-800 p-8 md:p-16">
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">À Propos de Nous</h1>

    <p className="mb-4 leading-relaxed">
      Bienvenue sur notre site! Nous sommes passionnés par [votre domaine d’activité] et dévoués à fournir des produits/services de haute qualité à nos clients. Depuis notre création en [année de fondation], nous avons toujours mis en avant l’innovation, l’excellence et la satisfaction de nos clients.
    </p>

    <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
    <p className="mb-4 leading-relaxed">
      Chez [Nom de l’entreprise], notre mission est de [décrivez votre mission en quelques mots]. Nous croyons en [vos valeurs ou principes fondamentaux] et nous nous engageons à apporter des solutions durables et efficaces à nos clients.
    </p>

    <h2 className="text-2xl font-semibold mb-4">Nos Valeurs</h2>
    <ul className="list-disc list-inside mb-4 leading-relaxed">
      <li><strong>Innovation :</strong> Nous restons à l’avant-garde des dernières tendances et technologies pour offrir des solutions modernes.</li>
      <li><strong>Intégrité :</strong> Nous valorisons la transparence et la confiance dans toutes nos relations professionnelles.</li>
      <li><strong>Engagement :</strong> Nous nous engageons à offrir une qualité irréprochable et un service client exceptionnel.</li>
    </ul>

    <h2 className="text-2xl font-semibold mb-4">Notre Histoire</h2>
    <p className="mb-4 leading-relaxed">
      [Nom de l’entreprise] a été fondée en [année] par [nom du fondateur]. Depuis lors, nous avons grandi et évolué pour devenir un acteur de confiance dans notre secteur. Nous sommes fiers de notre parcours et continuons d’innover pour répondre aux besoins de notre clientèle.
    </p>

    <h2 className="text-2xl font-semibold mb-4">Rencontrez Notre Équipe</h2>
    <p className="mb-4 leading-relaxed">
      Notre équipe est composée de professionnels passionnés et experts dans leurs domaines respectifs. Chaque membre de notre équipe apporte une expertise unique qui nous aide à offrir le meilleur à nos clients.
    </p>

    <h2 className="text-2xl font-semibold mb-4">Contactez-Nous</h2>
    <p className="mb-4 leading-relaxed">
      Nous serions ravis de discuter avec vous et de répondre à toutes vos questions. N’hésitez pas à nous contacter par email à <a href="mailto:contact@votresite.com" className="text-blue-600 underline">contact@votresite.com</a> ou par téléphone au <a href="tel:+33123456789" className="text-blue-600 underline">+33 1 23 45 67 89</a>.
    </p>
  </div>
</section>

  );
}
