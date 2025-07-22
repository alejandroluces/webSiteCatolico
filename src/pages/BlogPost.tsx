import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Calendar, User, ArrowLeft, Share2, BookOpen, Heart, Tag, Clock } from 'lucide-react';
import AdBanner from '../components/Ads/AdBanner';

const BlogPost: React.FC = () => {
  const { slug } = useParams();

  // Sample blog post data - in a real app, this would come from an API or CMS
  const blogPost = {
    id: 1,
    title: 'Cómo vivir la fe en el trabajo diario',
    slug: 'como-vivir-la-fe-en-el-trabajo',
    excerpt: 'Descubre maneras prácticas de integrar tu fe católica en tu vida profesional, siendo testimonio de Cristo en el ambiente laboral.',
    content: `
      <p>El trabajo no es solo una actividad para ganar dinero, sino una vocación que nos permite participar en la obra creadora de Dios. Como católicos, estamos llamados a santificar nuestro trabajo y a ser testimonio de Cristo en nuestro ambiente laboral.</p>

      <h2>La dignidad del trabajo</h2>
      <p>La Iglesia Católica enseña que el trabajo tiene una dignidad especial porque nos permite colaborar con Dios en su obra creadora. Cada tarea, por pequeña que parezca, puede convertirse en una oración cuando se realiza con amor y dedicación.</p>

      <h2>Principios para vivir la fe en el trabajo</h2>
      <h3>1. Integridad y honestidad</h3>
      <p>Ser honestos en todas nuestras transacciones, cumplir con nuestras responsabilidades y tratar a todos con respeto y dignidad. La integridad es el fundamento de un testimonio cristiano auténtico.</p>

      <h3>2. Servicio a los demás</h3>
      <p>Ver nuestro trabajo como una oportunidad de servir a otros. Ya sea que trabajemos directamente con personas o en tareas más técnicas, siempre podemos preguntarnos: "¿Cómo puede mi trabajo beneficiar a otros?"</p>

      <h3>3. Excelencia en el desempeño</h3>
      <p>Realizar nuestro trabajo con la mayor calidad posible, no solo para impresionar a nuestros superiores, sino como una forma de honrar a Dios con nuestros talentos.</p>

      <h2>Desafíos comunes y cómo enfrentarlos</h2>
      <p>En el ambiente laboral moderno, los católicos pueden enfrentar diversos desafíos para vivir su fe. Algunos de los más comunes incluyen:</p>

      <ul>
        <li><strong>Presión para comprometer valores éticos:</strong> Mantener firmes nuestros principios morales, incluso cuando esto pueda resultar difícil o impopular.</li>
        <li><strong>Competencia desleal:</strong> Competir de manera justa y ética, celebrando los éxitos de otros y aprendiendo de los fracasos.</li>
        <li><strong>Estrés y ansiedad:</strong> Confiar en la providencia de Dios y buscar el equilibrio entre el trabajo y la vida personal.</li>
      </ul>

      <h2>Oraciones para el trabajo</h2>
      <p>Comenzar y terminar cada día laboral con una oración puede transformar nuestra perspectiva del trabajo. Algunas sugerencias:</p>

      <blockquote>
        <p>"Señor, te ofrezco mi trabajo de hoy. Ayúdame a realizarlo con amor, paciencia y dedicación. Que todo lo que haga sea para tu gloria y el bien de mis hermanos."</p>
      </blockquote>

      <h2>El ejemplo de San José</h2>
      <p>San José, el padre adoptivo de Jesús, es el patrono de los trabajadores. Su ejemplo nos enseña que el trabajo humilde y bien hecho es una forma de santidad. José trabajó como carpintero, sustentando a la Sagrada Familia con dedicación y amor.</p>

      <p>Podemos invocar su intercesión para que nos ayude a encontrar sentido y propósito en nuestro trabajo diario, y para que nos conceda la gracia de ser buenos trabajadores y mejores cristianos.</p>

      <h2>Conclusión</h2>
      <p>Vivir la fe en el trabajo no significa predicar constantemente o hacer proselitismo agresivo. Más bien, se trata de ser coherentes entre lo que creemos y cómo actuamos, de tratar a todos con respeto y caridad, y de realizar nuestras tareas con la excelencia que honra a Dios.</p>

      <p>Recordemos que nuestro trabajo, cualquiera que sea, puede convertirse en un camino de santificación cuando lo ofrecemos a Dios y lo realizamos con amor.</p>
    `,
    author: 'Padre Miguel Rodríguez',
    date: '15 de Enero, 2025',
    readTime: '8 min',
    category: 'Espiritualidad',
    tags: ['trabajo', 'vocación', 'testimonio', 'san josé'],
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
  };

  const relatedPosts = [
    {
      title: 'La importancia de la oración familiar',
      slug: 'importancia-oracion-familiar',
      excerpt: 'La oración en familia fortalece los lazos y acerca a todos los miembros a Dios.',
      date: '12 de Enero, 2025',
    },
    {
      title: 'Santos patronos para estudiantes',
      slug: 'santos-patronos-estudiantes',
      excerpt: 'Conoce a los santos que interceden especialmente por quienes buscan conocimiento.',
      date: '10 de Enero, 2025',
    },
    {
      title: 'El sacramento de la Reconciliación',
      slug: 'sacramento-reconciliacion-guia',
      excerpt: 'Todo lo que necesitas saber sobre la confesión y el perdón de Dios.',
      date: '8 de Enero, 2025',
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-marian-blue-900 to-marian-blue-800 dark:from-gray-900 dark:to-gray-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <img
          src={blogPost.image}
          alt={blogPost.title}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            to="/blog"
            className="inline-flex items-center text-marian-blue-100 dark:text-gray-300 hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Blog
          </Link>
          
          <div className="max-w-3xl">
            <div className="flex items-center space-x-4 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sacred-gold-500 text-white">
                {blogPost.category}
              </span>
              <div className="flex items-center text-marian-blue-100 dark:text-gray-300 text-sm">
                <Calendar className="mr-1 h-4 w-4" />
                {blogPost.date}
              </div>
              <div className="flex items-center text-marian-blue-100 dark:text-gray-300 text-sm">
                <Clock className="mr-1 h-4 w-4" />
                {blogPost.readTime} lectura
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {blogPost.title}
            </h1>
            
            <p className="text-xl text-marian-blue-100 dark:text-gray-300 leading-relaxed mb-6">
              {blogPost.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium text-white">{blogPost.author}</div>
                  <div className="text-sm text-marian-blue-100 dark:text-gray-300">Autor</div>
                </div>
              </div>
              
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-3">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div 
                className="text-gray-800 dark:text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blogPost.content) }}
              />
            </div>

            <AdBanner position="inline" size="medium" />

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-marian-blue-900 dark:text-white mb-4">
                Etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-marian-blue-100 text-marian-blue-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-marian-blue-50 dark:bg-gray-800 rounded-xl p-6 text-center">
                <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                  ¿Te gustó este artículo?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Compártelo con otros para que también puedan beneficiarse de esta reflexión.
                </p>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-6 py-3 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Compartir Artículo
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Author Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Sobre el Autor
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-marian-blue-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-marian-blue-600 dark:text-sacred-gold-400" />
                  </div>
                  <div>
                    <div className="font-medium text-marian-blue-900 dark:text-white">
                      {blogPost.author}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Director Espiritual
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Sacerdote diocesano con 15 años de experiencia en evangelización digital 
                  y acompañamiento espiritual.
                </p>
              </div>

              <AdBanner position="sidebar" />

              {/* Related Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Artículos Relacionados
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="font-medium text-marian-blue-900 dark:text-white group-hover:text-marian-blue-700 dark:group-hover:text-sacred-gold-300 transition-colors duration-200 mb-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {post.date}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-gradient-to-br from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 text-white text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-4 text-sacred-gold-400 dark:text-sacred-gold-300" />
                <h3 className="text-lg font-serif font-semibold mb-3">
                  Recibe más contenido
                </h3>
                <p className="text-sm text-marian-blue-100 dark:text-gray-300 mb-4">
                  Suscríbete para recibir artículos como este en tu correo.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Suscribirse
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
