import React, { useState, Fragment } from 'react';
import { ShieldCheck, BookOpen, Users, Heart, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

const AprendeARezar: React.FC = () => {
  const [selectedPrayer, setSelectedPrayer] = useState<{ title: string; content: string } | null>(null);

  const openPrayerModal = (title: string, content: string) => {
    setSelectedPrayer({ title, content });
  };

  const closePrayerModal = () => {
    setSelectedPrayer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-marian-blue-900 dark:text-white font-serif">
            📿 Aprende a Rezar el Rosario
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
            Una guía paso a paso para principiantes
          </p>
        </header>

        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-12 text-center">
          <Link
            to="/rosario-interactivo"
            className="inline-block bg-marian-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-marian-blue-600 transition-colors duration-300"
          >
            Ir al Rosario Interactivo
          </Link>
        </section>

        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-12">
          <h2 className="text-3xl font-semibold text-marian-blue-800 dark:text-white mb-6 font-serif">¿Qué es el Rosario?</h2>
          <p className="text-lg leading-relaxed">
            El Santo Rosario es una de las oraciones marianas más queridas de la Iglesia Católica. Es una meditación sobre los misterios de la vida de Jesús y María, que nos ayuda a crecer en fe y amor hacia Dios.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-marian-blue-800 dark:text-white mb-4 font-serif">Antes de Comenzar</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start"><ShieldCheck className="h-6 w-6 text-green-500 mr-3 mt-1" /> <div><strong>Lo que necesitas:</strong> Un rosario, un lugar tranquilo y 15-20 minutos.</div></li>
                <li className="flex items-start"><Heart className="h-6 w-6 text-red-500 mr-3 mt-1" /> <div><strong>Preparación espiritual:</strong> Haz la señal de la cruz y pide a María que te acompañe.</div></li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-marian-blue-800 dark:text-white mb-4 font-serif">Estructura del Rosario</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-xl mb-2">Parte Introductoria</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-marian-blue-100 dark:hover:bg-marian-blue-900 transition-colors duration-200" onClick={() => openPrayerModal('Señal de la Cruz', 'En el nombre del Padre, del Hijo y del Espíritu Santo. Amén.')}>
                      <p className="font-semibold">Señal de la Cruz &rarr;</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-marian-blue-100 dark:hover:bg-marian-blue-900 transition-colors duration-200" onClick={() => openPrayerModal('Credo de los Apóstoles', 'Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.')}>
                      <p className="font-semibold">Credo de los Apóstoles &rarr;</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-marian-blue-100 dark:hover:bg-marian-blue-900 transition-colors duration-200" onClick={() => openPrayerModal('Padrenuestro', 'Padre nuestro que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.')}>
                      <p className="font-semibold">Padrenuestro &rarr;</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-marian-blue-100 dark:hover:bg-marian-blue-900 transition-colors duration-200" onClick={() => openPrayerModal('Tres Avemarías', 'Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.')}>
                      <p className="font-semibold">Tres Avemarías &rarr;</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-marian-blue-100 dark:hover:bg-marian-blue-900 transition-colors duration-200" onClick={() => openPrayerModal('Gloria al Padre', 'Gloria al Padre, al Hijo y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.')}>
                      <p className="font-semibold">Gloria al Padre &rarr;</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">Los Cinco Decenarios</h4>
                  <p className="text-lg">Cada decenario incluye: anunciar el misterio, un Padrenuestro, diez Avemarías, un Gloria y una jaculatoria.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-marian-blue-800 dark:text-white mb-6 font-serif">Los Misterios del Rosario</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-xl text-yellow-500">Misterios Gozosos (lunes y sábado)</h4>
                <ol className="list-decimal list-inside text-lg">
                  <li>La encarnación del Hijo de Dios.</li>
                  <li>La visitación de Nuestra Señora a su prima Santa Isabel.</li>
                  <li>El nacimiento del Hijo de Dios.</li>
                  <li>La Presentación de Jesús en el templo.</li>
                  <li>El Niño Jesús perdido y hallado en el templo.</li>
                </ol>
              </div>
              <div>
                <h4 className="font-bold text-xl text-blue-400">Misterios Luminosos (jueves)</h4>
                <ol className="list-decimal list-inside text-lg">
                  <li>El Bautismo de Jesús en el Jordán.</li>
                  <li>La autorrevelación de Jesús en las bodas de Caná.</li>
                  <li>El anuncio del Reino de Dios invitando a la conversión.</li>
                  <li>La Transfiguración.</li>
                  <li>La Institución de la Eucaristía.</li>
                </ol>
              </div>
              <div>
                <h4 className="font-bold text-xl text-red-500">Misterios Dolorosos (martes y viernes)</h4>
                <ol className="list-decimal list-inside text-lg">
                  <li>La Oración de Jesús en el Huerto.</li>
                  <li>La Flagelación del Señor.</li>
                  <li>La Coronación de espinas.</li>
                  <li>Jesús con la Cruz a cuestas camino del Calvario.</li>
                  <li>La Crucifixión y Muerte de Nuestro Señor.</li>
                </ol>
              </div>
              <div>
                <h4 className="font-bold text-xl text-green-500">Misterios Gloriosos (miércoles y domingo)</h4>
                <ol className="list-decimal list-inside text-lg">
                  <li>La Resurrección del Hijo de Dios.</li>
                  <li>La Ascensión del Señor a los Cielos.</li>
                  <li>La Venida del Espíritu Santo sobre los Apóstoles.</li>
                  <li>La Asunción de Nuestra Señora a los Cielos.</li>
                  <li>La Coronación de la Santísima Virgen como Reina de Cielos y Tierra.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mt-12">
          <h2 className="text-3xl font-semibold text-marian-blue-800 dark:text-white mb-6 font-serif">Oraciones Finales</h2>
          <div className="space-y-3">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-marian-blue-100 dark:hover:bg-marian-blue-900 transition-colors duration-200" onClick={() => openPrayerModal('Salve Regina', 'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María!')}>
              <p className="font-semibold">Salve Regina &rarr;</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-marian-blue-100 dark:hover:bg-marian-blue-900 transition-colors duration-200" onClick={() => openPrayerModal('Oración Final', 'Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.')}>
              <p className="font-semibold">Oración Final &rarr;</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-marian-blue-800 dark:text-white mb-6 text-center font-serif">Consejos y Beneficios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <BookOpen className="h-10 w-10 text-marian-blue-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">Consejos para Principiantes</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Visualiza cada misterio.</li>
                <li>No te apresures.</li>
                <li>Si te distraes, vuelve a la oración.</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Users className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">Frecuencia Recomendada</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Principiantes:</strong> 3 veces/semana</li>
                <li><strong>Intermedio:</strong> 5 veces/semana</li>
                <li><strong>Avanzado:</strong> Diariamente</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Heart className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">Beneficios Espirituales</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Paz interior y tranquilidad.</li>
                <li>Fortalecimiento de la fe.</li>
                <li>Protección espiritual.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Transition appear show={selectedPrayer !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closePrayerModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-xl transition-all">
                  {selectedPrayer && (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-serif font-bold leading-6 text-marian-blue-900 dark:text-white mb-4"
                      >
                        {selectedPrayer.title}
                      </Dialog.Title>
                      <div className="mt-4 prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line font-sans text-lg leading-relaxed">
                          {selectedPrayer.content}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="mt-8">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-marian-blue-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-marian-blue-900 dark:text-white hover:bg-marian-blue-200 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-marian-blue-500 focus-visible:ring-offset-2"
                      onClick={closePrayerModal}
                    >
                      Cerrar
                    </button>
                  </div>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={closePrayerModal}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AprendeARezar;
