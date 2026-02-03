import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RapidApiTrademark {
  keyword: string;
  serialNumber: string;
  registrationNumber?: string;
  markIdentification: string;
  status: string;
  statusDate?: string;
  filingDate?: string;
  registrationDate?: string;
  ownerName?: string;
  owner?: string;
  goodsServices?: string;
  markDrawingCode?: string;
  [key: string]: any;
}

interface RapidApiResponse {
  count?: number;
  items?: RapidApiTrademark[];
  trademarks?: RapidApiTrademark[];
  results?: RapidApiTrademark[];
  data?: RapidApiTrademark[];
  error?: string;
  message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { searchTerm, status = "active", start = 1, maxResults = 100 } = requestBody;

    console.log('Search request received:', { searchTerm, status, start, maxResults });

    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      console.error('Invalid search term provided');
      return new Response(
        JSON.stringify({ error: 'Search term is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    const rapidApiHost = Deno.env.get('RAPIDAPI_HOST') || 'uspto-trademark.p.rapidapi.com';

    console.log('Checking credentials:', {
      hasApiKey: !!rapidApiKey,
      apiKeyLength: rapidApiKey?.length || 0,
      host: rapidApiHost
    });

    if (!rapidApiKey) {
      console.error('RapidAPI key not configured in Supabase environment');
      return new Response(
        JSON.stringify({
          unavailable: true,
          error: 'Trademark search service not configured',
          message: 'The DIY search feature requires RapidAPI credentials to be configured in Supabase.'
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Credentials found, proceeding with search');

    const encodedKeyword = encodeURIComponent(searchTerm.trim());
    const apiUrl = `https://${rapidApiHost}/v1/trademarkSearch/${encodedKeyword}/all`;

    console.log(`Fetching from RapidAPI USPTO:`, apiUrl);
    console.log(`Search term:`, searchTerm);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let allTrademarks: RapidApiTrademark[] = [];
    let upstreamStatus = 0;
    let rawResponse = '';
    let upstreamLocation = '';

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'X-RapidAPI-Host': rapidApiHost,
          'X-RapidAPI-Key': rapidApiKey,
        },
        redirect: 'manual',
      });

      clearTimeout(timeoutId);
      upstreamStatus = response.status;
      upstreamLocation = response.headers.get('location') || '';

      console.log(`Response status: ${response.status} ${response.statusText}`);
      console.log(`Upstream status: ${upstreamStatus}`);
      if (upstreamLocation) {
        console.log(`Upstream location: ${upstreamLocation}`);
      }

      if (response.status === 302 || response.status === 301) {
        rawResponse = await response.text();
        console.error(`RapidAPI redirected to: ${upstreamLocation}`);
        console.error(`Response body: ${rawResponse.substring(0, 500)}`);
        return new Response(
          JSON.stringify({
            unavailable: true,
            error: 'Trademark search service unavailable',
            message: 'The RapidAPI service appears to be offline or has been migrated.',
            upstreamStatus,
            upstreamLocation,
            raw: rawResponse.substring(0, 1000)
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.status === 401 || response.status === 403) {
        rawResponse = await response.text();
        console.error(`Authentication failed (${response.status}):`, rawResponse.substring(0, 500));
        return new Response(
          JSON.stringify({
            unavailable: true,
            error: 'Authentication failed',
            message: 'RapidAPI key is invalid or expired.',
            upstreamStatus,
            upstreamLocation,
            raw: rawResponse.substring(0, 1000)
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.status === 429) {
        rawResponse = await response.text();
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests to RapidAPI. Please try again later.',
            upstreamStatus,
            upstreamLocation,
            raw: rawResponse.substring(0, 1000)
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (!response.ok) {
        rawResponse = await response.text();
        console.error(`RapidAPI error response (${response.status}):`, rawResponse.substring(0, 500));

        return new Response(
          JSON.stringify({
            error: `RapidAPI returned status ${response.status}`,
            message: response.statusText,
            upstreamStatus,
            upstreamLocation,
            raw: rawResponse.substring(0, 1000)
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const contentType = response.headers.get('content-type') || '';
      rawResponse = await response.text();

      console.log('Raw response preview:', rawResponse.substring(0, 500));

      if (!contentType.includes('application/json')) {
        console.error('RapidAPI returned non-JSON response:', rawResponse.substring(0, 500));
        return new Response(
          JSON.stringify({
            unavailable: true,
            error: 'Unexpected response format',
            message: 'RapidAPI did not return JSON.',
            upstreamStatus,
            upstreamLocation,
            contentType,
            raw: rawResponse.substring(0, 1000)
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      let data: RapidApiResponse;
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        return new Response(
          JSON.stringify({
            unavailable: true,
            error: 'Invalid JSON response',
            message: 'Failed to parse RapidAPI response.',
            upstreamStatus,
            raw: rawResponse.substring(0, 1000)
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      console.log(`RapidAPI response structure:`, Object.keys(data));

      if (data.error || data.message?.toLowerCase().includes('error')) {
        console.error('RapidAPI returned error:', data.error || data.message);
        return new Response(
          JSON.stringify({
            unavailable: true,
            error: data.error || 'API Error',
            message: data.message || 'The trademark search returned an error.',
            upstreamStatus,
            raw: rawResponse.substring(0, 1000)
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const trademarkArray = data.items || data.trademarks || data.results || data.data || [];

      if (Array.isArray(trademarkArray) && trademarkArray.length > 0) {
        allTrademarks = trademarkArray;
      } else if (Array.isArray(data)) {
        allTrademarks = data;
      }

      console.log(`Found ${allTrademarks.length} trademarks`);
      if (allTrademarks.length > 0) {
        console.log('First trademark sample fields:', Object.keys(allTrademarks[0]));
        console.log('First trademark full data:', JSON.stringify(allTrademarks[0], null, 2));
        console.log('First trademark owners field:', allTrademarks[0].owners);
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('RapidAPI request timed out');
        return new Response(
          JSON.stringify({
            error: 'Request timeout',
            message: 'Trademark search timed out. Please try again.'
          }),
          {
            status: 408,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      throw fetchError;
    }

    let filteredTrademarks = allTrademarks;
    if (status === 'active') {
      filteredTrademarks = allTrademarks.filter(tm => {
        const tmStatus = (tm.status || '').toLowerCase();
        return tmStatus.includes('registered') ||
               tmStatus.includes('active') ||
               tmStatus.includes('live') ||
               tmStatus.includes('pending');
      });
    }

    const extractOwnerName = (tm: any): string => {
      if (tm.owners) {
        if (Array.isArray(tm.owners) && tm.owners.length > 0) {
          return tm.owners[0].name || tm.owners[0].ownerName || '';
        } else if (typeof tm.owners === 'object' && tm.owners.name) {
          return tm.owners.name;
        }
      }
      return tm.ownerName || tm.owner || tm['owner name'] || tm.owner_name || tm.applicant || tm.registrant || '';
    };

    const calculateRelevance = (tm: any, searchLower: string): number => {
      let score = 0;
      const mark = (tm.markIdentification || tm.keyword || '').toLowerCase();

      if (mark === searchLower) score += 100;
      else if (mark.startsWith(searchLower)) score += 50;
      else if (mark.includes(searchLower)) score += 25;

      const tmStatus = (tm.status || '').toLowerCase();
      if (tmStatus.includes('registered')) score += 10;
      else if (tmStatus.includes('active') || tmStatus.includes('live')) score += 5;

      return score;
    };

    const searchLower = searchTerm.toLowerCase();
    const sortedTrademarks = filteredTrademarks.sort((a, b) => {
      return calculateRelevance(b, searchLower) - calculateRelevance(a, searchLower);
    });

    const formattedTrademarks = sortedTrademarks.slice(0, maxResults).map(tm => ({
      keyword: tm.keyword || tm.markIdentification || searchTerm,
      serialNumber: tm.serialNumber || tm['serial number'] || tm.serial_number || '',
      registrationNumber: tm.registrationNumber || tm['registration number'] || tm.registration_number,
      markIdentification: tm.markIdentification || tm.keyword || searchTerm,
      status: tm.status || tm.status_label || 'Unknown',
      statusLabel: tm.status_label || tm.statusLabel || tm.status || 'Unknown',
      statusCode: tm.status_code || tm.statusCode,
      statusDate: tm.statusDate || tm['status date'] || tm.status_date || '',
      statusDefinition: tm.status_definition || tm.statusDefinition || tm.status_description || '',
      filingDate: tm.filingDate || tm['filing date'] || tm.filing_date || '',
      registrationDate: tm.registrationDate || tm['registration date'] || tm.registration_date || '',
      abandonmentDate: tm.abandonmentDate || tm['abandonment date'] || tm.abandonment_date || '',
      expirationDate: tm.expirationDate || tm['expiration date'] || tm.expiration_date || '',
      logo: tm.logo || tm.image || tm.mark_image || '',
      description: tm.description || tm.markDescription || tm.mark_description || tm.goodsServices || tm['goods/services'] || '',
      owner: extractOwnerName(tm),
      goodsServices: tm.goodsServices || tm['goods/services'] || tm.goods_services || ''
    }));

    return new Response(
      JSON.stringify({
        count: filteredTrademarks.length,
        trademarks: formattedTrademarks,
        searchTerm,
        status,
        upstreamStatus,
        upstreamLocation: upstreamLocation || undefined
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in search-uspto-trademarks function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({
        error: 'Failed to search trademarks',
        message: errorMessage,
        trademarks: []
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});