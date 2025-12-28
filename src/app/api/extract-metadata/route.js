import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

async function safeFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeout || 10000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

function absolutizeUrl(maybeUrl, base) {
  if (!maybeUrl) return '';
  try {
    if (maybeUrl.startsWith('//')) return 'https:' + maybeUrl;
    if (maybeUrl.startsWith('http://') || maybeUrl.startsWith('https://')) return maybeUrl;
    return new URL(maybeUrl, base).href;
  } catch {
    return maybeUrl;
  }
}

function uniq(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Validate URL
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the webpage with better error handling and retries
    let response;
    try {
      const headersReq = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.8',
        'Connection': 'keep-alive',
      };
      const attempts = 2;
      let lastErr;
      for (let i = 0; i < attempts; i++) {
        try {
          response = await safeFetch(url, { headers: headersReq, timeout: 12000 });
          if (response?.ok) break;
        } catch (e) {
          lastErr = e;
          if (i === attempts - 1) throw e;
        }
      }
      if (!response) throw lastErr || new Error('Failed to fetch');
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ 
        error: 'Network error: Unable to reach the URL',
        details: fetchError.message 
      }, { status: 400, headers });
    }

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        details: `The server returned status ${response.status}`
      }, { status: 400, headers });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract basic metadata (OG, Twitter, standard)
    const title = $('meta[property="og:title"]').attr('content') ||
                  $('meta[name="twitter:title"]').attr('content') ||
                  $('title').text() ||
                  'Untitled';

    const description = $('meta[property="og:description"]').attr('content') ||
                        $('meta[name="twitter:description"]').attr('content') ||
                        $('meta[name="description"]').attr('content') ||
                        '';

    const ogImages = [
      $('meta[property="og:image"]').attr('content'),
      $('meta[name="twitter:image"]').attr('content'),
      $('meta[name="twitter:image:src"]').attr('content'),
    ].filter(Boolean);
    let image = ogImages[0] || '';

    // If no image found in meta tags, try specific selectors
    if (!image) {
      const imageSelectors = [
        // Amazon specific selectors
        '#landingImage',
        '#imgTagWrapperId img',
        '.a-dynamic-image',
        '[data-old-hires]',
        '[data-a-dynamic-image]',
        '.a-dynamic-image-container img',
        '#main-image-container img',
        '#imageBlock img',
        '.imageBlock img',
        '#imgBlkFront',
        '#img-canvas img',
        '.a-dynamic-image-container',
        '.a-button-selected .a-dynamic-image',
        '.a-carousel-viewport img',
        '.a-carousel-card img',
        '.a-spacing-small img',
        '.a-spacing-base img',
        // Amazon mobile selectors
        '#mobile-landing-image',
        '.mobile-landing-image',
        '.a-mobile-carousel img',
        // Amazon alternative selectors
        'img[data-a-image-name="landingImage"]',
        'img[data-a-dynamic-image]',
        'img[data-old-hires]',
        'img[data-a-hires]',
        // Generic e-commerce selectors
        '.product-image img',
        '.product-photo img',
        '.main-image img',
        '.hero-image img',
        '.product-gallery img',
        '.gallery img',
        '.image-gallery img',
        '.product-image-container img',
        // Generic selectors
        'img[alt*="product"]',
        'img[alt*="Product"]',
        'img[class*="product"]',
        'img[class*="main"]',
        'img[class*="hero"]',
        'img[class*="primary"]',
        'img[class*="featured"]',
        // Flipkart specific
        '._396cs4',
        '._2r_T1I',
        '._3exPp9',
        '._1BweB8',
        '._2QfC02',
        '._1kMSca',
        // Myntra specific
        '.image-grid-image',
        '.pdp-product-image',
        '.product-image',
        '.image-grid-image img',
        '.pdp-product-image img',
        '.product-image img',
        '.image-grid-imageContainer img',
        '.pdp-product-imageContainer img',
        // Nykaa specific
        '.pdp-product-image',
        '.product-image-container',
        '.main-product-image',
        '.pdp-product-image img',
        '.product-image-container img',
        '.main-product-image img',
        '.pdp-product-imageContainer img',
        // Ajio specific
        '.pdp-product-image',
        '.product-image',
        '.pdp-product-image img',
        '.product-image img',
        '.pdp-product-imageContainer img',
        // Snapdeal specific
        '.product-image',
        '.pdp-product-image',
        '.product-image img',
        '.pdp-product-image img',
        '.product-imageContainer img',
        // Paytm Mall specific
        '.product-image',
        '.pdp-product-image',
        '.product-image img',
        '.pdp-product-image img',
        '.product-imageContainer img',
        // ShopClues specific
        '.product-image',
        '.pdp-product-image',
        '.product-image img',
        '.pdp-product-image img',
        '.product-imageContainer img',
        // BigBasket specific
        '.product-image',
        '.pdp-product-image',
        '.product-image img',
        '.pdp-product-image img',
        '.product-imageContainer img',
        // Grofers/Blinkit specific
        '.product-image',
        '.pdp-product-image',
        '.product-image img',
        '.pdp-product-image img',
        '.product-imageContainer img',
        // eBay specific
        '#icImg',
        '.img img',
        '.u-flip img',
        '.img img[itemprop="image"]',
        // Walmart specific
        '.prod-ProductImageHero-image',
        '.prod-ProductImageHero-image img',
        '.prod-ProductImage-image img',
        // Target specific
        '.h-padding-r-tiny img',
        '.h-padding-r-tiny img[data-test="product-image"]',
        // Best Buy specific
        '.product-image img',
        '.product-image img[data-test="product-image"]',
        // Generic e-commerce fallbacks
        'img[alt*="product"]',
        'img[alt*="Product"]',
        'img[class*="product"]',
        'img[class*="main"]',
        'img[class*="hero"]',
        'img[class*="primary"]',
        'img[class*="featured"]'
      ];

      for (const selector of imageSelectors) {
        const imgElement = $(selector).first();
        if (imgElement.length) {
          const src = imgElement.attr('src') || 
                     imgElement.attr('data-src') || 
                     imgElement.attr('data-lazy') ||
                     imgElement.attr('data-old-hires') ||
                     imgElement.attr('data-a-dynamic-image') ||
                     imgElement.attr('data-a-hires') ||
                     imgElement.attr('data-zoom-image') ||
                     imgElement.attr('data-large-image') ||
                     imgElement.attr('data-main-image') ||
                     imgElement.attr('data-original') ||
                     imgElement.attr('data-srcset')?.split(' ')[0] ||
                     imgElement.attr('srcset')?.split(' ')[0];
          
          if (src && (src.startsWith('http') || src.startsWith('//'))) {
            // Handle protocol-relative URLs
            if (src.startsWith('//')) {
              image = 'https:' + src;
            } else {
              image = src;
            }
            break;
          }
        }
      }
    }

    // Final fallback - try to find any image on the page
    if (!image) {
      const fallbackImages = $('img[src*="amazon"], img[src*="product"], img[alt*="product"], img[alt*="Product"]').first();
      if (fallbackImages.length) {
        const fallbackSrc = fallbackImages.attr('src') || fallbackImages.attr('data-src');
        if (fallbackSrc && (fallbackSrc.startsWith('http') || fallbackSrc.startsWith('//'))) {
          image = fallbackSrc.startsWith('//') ? 'https:' + fallbackSrc : fallbackSrc;
        }
      }
    }

    // Extract price if available (common selectors)
    let price = null;
    const priceSelectors = [
      // Flipkart specific selectors
      '[class*="_30jeq3"]', // Flipkart main price class
      '[class*="_16Jk6d"]', // Flipkart price class
      '[class*="-KdBdD"]', // Flipkart price class
      '[class*="_1vC4OE"]', // Flipkart price class
      '[class*="_3I9_wc"]', // Flipkart price class
      '[class*="_2p7I2H"]', // Flipkart price class
      // Myntra specific selectors
      '.pdp-price',
      '.pdp-product-price',
      '.product-price',
      '.pdp-price .pdp-product-price',
      '.pdp-price .product-price',
      'product-item-selling-price',
      '[class*="pdp-price"]',
      '[class*="product-price"]',
      // Nykaa specific selectors
      '.pdp-price',
      '.pdp-product-price',
      '.product-price',
      '.pdp-price .pdp-product-price',
      '.pdp-price .product-price',
      '[class*="pdp-price"]',
      '[class*="product-price"]',
      // Ajio specific selectors
      '.pdp-price',
      '.pdp-product-price',
      '.product-price',
      '.pdp-price .pdp-product-price',
      '.pdp-price .product-price',
      '[class*="pdp-price"]',
      '[class*="product-price"]',
      // Snapdeal specific selectors
      '.pdp-price',
      '.pdp-product-price',
      '.product-price',
      '.pdp-price .pdp-product-price',
      '.pdp-price .product-price',
      '[class*="pdp-price"]',
      '[class*="product-price"]',
      // Paytm Mall specific selectors
      '.pdp-price',
      '.pdp-product-price',
      '.product-price',
      '.pdp-price .pdp-product-price',
      '.pdp-price .product-price',
      '[class*="pdp-price"]',
      '[class*="product-price"]',
      // ShopClues specific selectors
      '.pdp-price',
      '.pdp-product-price',
      '.product-price',
      '.pdp-price .pdp-product-price',
      '.pdp-price .product-price',
      '[class*="pdp-price"]',
      '[class*="product-price"]',
      // BigBasket specific selectors
      '.pdp-price',
      '.pdp-product-price',
      '.product-price',
      '.pdp-price .pdp-product-price',
      '.pdp-price .product-price',
      '[class*="pdp-price"]',
      '[class*="product-price"]',
      // Grofers/Blinkit specific selectors
      '.pdp-price',
      '.pdp-product-price',
      '.product-price',
      '.pdp-price .pdp-product-price',
      '.pdp-price .product-price',
      '[class*="pdp-price"]',
      '[class*="product-price"]',
      // eBay specific selectors
      '.notranslate',
      '.u-flip',
      '.notranslate .u-flip',
      '[class*="notranslate"]',
      '[class*="u-flip"]',
      // Walmart specific selectors
      '.price-current',
      '.price-current .visuallyhidden',
      '.price-current .visuallyhidden .price-group',
      '[class*="price-current"]',
      '[class*="price-group"]',
      // Target specific selectors
      '[data-test="product-price"]',
      '.h-text-lg',
      '.h-text-lg .h-text-lg',
      '[class*="h-text-lg"]',
      // Best Buy specific selectors
      '.priceView-customer-price',
      '.priceView-customer-price .visually-hidden',
      '[class*="priceView-customer-price"]',
      // Generic selectors
      '[class*="price"]',
      '[data-testid*="price"]',
      '.price',
      '.product-price',
      '[class*="price"]',
      '[id*="price"]',
      'meta[property="product:price:amount"]',
      'meta[property="og:price:amount"]',
      // Generic price patterns
      '[class*="rupee"]',
      '[class*="rs"]',
      '[class*="₹"]',
      // E-commerce specific
      '[data-testid="price"]',
      '[data-testid="product-price"]',
      '.a-price-whole', // Amazon
      '.a-offscreen', // Amazon
      '.price-current', // Generic
      '.price-now', // Generic
      '.sale-price', // Generic
      '.current-price', // Generic
    ];

    for (const selector of priceSelectors) {
      const priceElement = $(selector).first();
      if (priceElement.length) {
        const priceText = priceElement.attr('content') || priceElement.text();
        
        // Enhanced price extraction for Indian and international formats
        const pricePatterns = [
          /₹\s*([\d,]+(?:\.\d{2})?)/, // ₹1,234.56
          /Rs\.?\s*([\d,]+(?:\.\d{2})?)/, // Rs. 1,234.56
          /INR\s*([\d,]+(?:\.\d{2})?)/, // INR 1,234.56
          /\$\s*([\d,]+(?:\.\d{2})?)/, // $1,234.56
          /€\s*([\d,]+(?:\.\d{2})?)/, // €1,234.56
          /£\s*([\d,]+(?:\.\d{2})?)/, // £1,234.56
          /([\d,]+(?:\.\d{2})?)\s*₹/, // 1,234.56 ₹
          /([\d,]+(?:\.\d{2})?)\s*Rs/, // 1,234.56 Rs
          /([\d,]+(?:\.\d{2})?)\s*INR/, // 1,234.56 INR
          /([\d,]+(?:\.\d{2})?)\s*\$/, // 1,234.56 $
          /([\d,]+(?:\.\d{2})?)\s*€/, // 1,234.56 €
          /([\d,]+(?:\.\d{2})?)\s*£/, // 1,234.56 £
          /([\d,]+(?:\.\d{2})?)/, // Just numbers with commas
        ];
        
        for (const pattern of pricePatterns) {
          const match = priceText.match(pattern);
          if (match) {
            const priceValue = parseFloat(match[1].replace(/,/g, ''));
            if (priceValue > 0) {
              price = priceValue;
              break;
            }
          }
        }
        
        if (price) break;
      }
    }

    // Extract brand if available
    let brand = $('meta[property="og:site_name"]').attr('content') || 
                $('meta[name="application-name"]').attr('content') || 
                '';

    // Clean up brand name
    if (brand) {
      brand = brand.replace(/^(www\.|https?:\/\/)/, '').split('.')[0];
      brand = brand.charAt(0).toUpperCase() + brand.slice(1);
    }

    // Detect currency based on domain and price format
    let currency = 'USD';
    const hostname = validUrl.hostname.toLowerCase();
    
    // Indian e-commerce sites (INR)
    if (hostname.includes('flipkart.com') || 
        hostname.includes('amazon.in') ||
        hostname.includes('myntra.com') ||
        hostname.includes('nykaa.com') ||
        hostname.includes('ajio.com') ||
        hostname.includes('snapdeal.com') ||
        hostname.includes('paytmmall.com') ||
        hostname.includes('shopclues.com') ||
        hostname.includes('bigbasket.com') ||
        hostname.includes('grofers.com') ||
        hostname.includes('blinkit.com') ||
        hostname.includes('jiomart.com') ||
        hostname.includes('tatacliq.com') ||
        hostname.includes('reliancedigital.in') ||
        hostname.includes('croma.com') ||
        hostname.includes('vijaysales.com')) {
      currency = 'INR';
    } 
    // UK sites (GBP)
    else if (hostname.includes('amazon.co.uk') ||
             hostname.includes('asos.com') ||
             hostname.includes('argos.co.uk') ||
             hostname.includes('johnlewis.com') ||
             hostname.includes('next.co.uk') ||
             hostname.includes('marksandspencer.com')) {
      currency = 'GBP';
    } 
    // European sites (EUR)
    else if (hostname.includes('amazon.de') ||
             hostname.includes('zalando.com') ||
             hostname.includes('zalando.de') ||
             hostname.includes('zalando.fr') ||
             hostname.includes('zalando.it') ||
             hostname.includes('zalando.es') ||
             hostname.includes('amazon.fr') ||
             hostname.includes('amazon.it') ||
             hostname.includes('amazon.es') ||
             hostname.includes('otto.de') ||
             hostname.includes('h&m.com') ||
             hostname.includes('zara.com')) {
      currency = 'EUR';
    }
    // Canadian sites (CAD)
    else if (hostname.includes('amazon.ca') ||
             hostname.includes('walmart.ca') ||
             hostname.includes('bestbuy.ca') ||
             hostname.includes('canadiantire.ca')) {
      currency = 'CAD';
    }
    // Australian sites (AUD)
    else if (hostname.includes('amazon.com.au') ||
             hostname.includes('woolworths.com.au') ||
             hostname.includes('coles.com.au') ||
             hostname.includes('kmart.com.au')) {
      currency = 'AUD';
    }
    // Japanese sites (JPY)
    else if (hostname.includes('amazon.co.jp') ||
             hostname.includes('rakuten.co.jp') ||
             hostname.includes('yahoo.co.jp')) {
      currency = 'JPY';
    }

    // Try oEmbed discovery
    let oembedData = null;
    try {
      const oembedLink = $('link[type="application/json+oembed"]').attr('href') || $('link[type="text/json+oembed"]').attr('href');
      if (oembedLink) {
        const oembedRes = await safeFetch(absolutizeUrl(oembedLink, validUrl.origin), { timeout: 8000 });
        if (oembedRes.ok) {
          oembedData = await oembedRes.json();
        }
      }
    } catch {}

    // Try JSON-LD structured data
    const jsonLd = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const text = $(el).contents().text();
        const parsed = JSON.parse(text);
        jsonLd.push(parsed);
      } catch {}
    });

    // Favicon discovery
    const favicon = absolutizeUrl(
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '/favicon.ico',
      validUrl.origin
    );

    // Media discovery (images, videos, audio)
    const images = uniq([
      ...ogImages.map(u => absolutizeUrl(u, validUrl.origin)),
      ...$('img').map((_, el) => $(el).attr('src')).get().map(u => absolutizeUrl(u, validUrl.origin)),
    ]).slice(0, 20);

    const videos = uniq([
      $('meta[property="og:video"]').attr('content'),
      $('meta[name="twitter:player"]').attr('content'),
      ...$('video source').map((_, el) => $(el).attr('src')).get(),
      ...$('video').map((_, el) => $(el).attr('src')).get(),
    ].map(u => absolutizeUrl(u, validUrl.origin))).slice(0, 10);

    const audios = uniq([
      $('meta[property="og:audio"]').attr('content'),
      ...$('audio source').map((_, el) => $(el).attr('src')).get(),
      ...$('audio').map((_, el) => $(el).attr('src')).get(),
    ].map(u => absolutizeUrl(u, validUrl.origin))).slice(0, 10);

    // Provider-specific fallbacks (Instagram reels/posts)
    const embeds = [];
    try {
      const isInstagram = hostname.includes('instagram.com');
      const looksLikeIgMedia = /\/reel\/|\/p\//.test(validUrl.pathname);
      if (isInstagram && looksLikeIgMedia && videos.length === 0) {
        // Prefer Graph API oEmbed if token provided
        const igToken = process.env.IG_OEMBED_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN;
        let igOembedUrl = null;
        if (igToken) {
          igOembedUrl = `https://graph.facebook.com/v17.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${encodeURIComponent(igToken)}&omitscript=true&maxwidth=640`;
        } else {
          // Legacy endpoint (may be rate-limited or require token in some regions)
          igOembedUrl = `https://www.instagram.com/oembed/?url=${encodeURIComponent(url)}&omitscript=true&maxwidth=640`;
        }
        try {
          const igRes = await safeFetch(igOembedUrl, { timeout: 8000 });
          if (igRes.ok) {
            const igJson = await igRes.json();
            if (igJson?.thumbnail_url) {
              images.unshift(absolutizeUrl(igJson.thumbnail_url, validUrl.origin));
            }
            if (igJson?.html) {
              embeds.push({ provider: 'instagram', html: igJson.html });
            }
          }
        } catch {}
      }
    } catch {}

    // Clean up title
    const cleanTitle = title.trim().replace(/\s+/g, ' ');

    // Clean up description
    const cleanDescription = description.trim().replace(/\s+/g, ' ').substring(0, 200);

    // Make image URL absolute if it's relative
    let absoluteImageUrl = absolutizeUrl(image, validUrl.origin);

    return NextResponse.json({
      success: true,
      data: {
        title: cleanTitle,
        description: cleanDescription,
        image: absoluteImageUrl,
        images,
        videos,
        audios,
        oembed: oembedData || undefined,
        jsonLd: jsonLd.length ? jsonLd : undefined,
        favicon,
        embeds: embeds.length ? embeds : undefined,
        price: price,
        currency: currency,
        brand: brand,
        url: url,
        domain: validUrl.hostname,
      }
    }, { headers });

  } catch (error) {
    console.error('Error extracting metadata:', error);
    return NextResponse.json({ 
      error: 'Failed to extract metadata',
      details: error.message 
    }, { status: 500, headers });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
