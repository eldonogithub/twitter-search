package ca.blackperl;

import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Vector;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import twitter4j.TwitterStream;
import au.com.bytecode.opencsv.CSVWriter;

/**
 * Generates a summary of the current stats each minute
 */
final class SummaryTask extends TimerTask
{
    private static final Log log = LogFactory.getLog(SummaryTask.class);

    private final Timer timer;
    private final TwitterStream twitterStream;
    private int iterations = 0;
    private PhraseListener listener;
    private CSVWriter writer;

    private SimpleDateFormat sdf;

    SummaryTask(PhraseListener listener, Timer timer,
            TwitterStream twitterStream)
    {
        this.listener = listener;
        this.timer = timer;
        this.twitterStream = twitterStream;
        sdf = new SimpleDateFormat("yyy-MM-dd HH:mm:ss");
        try
        {
            FileWriter fileWriter = new FileWriter("twitter-search.csv");
            writer = new CSVWriter(fileWriter, ',');
            // feed in your array (or convert your data to an array)
            
            header();
        }
        catch (IOException e)
        {
            log.error("An exception has occurred: " + e, e);
        }
    }

    @Override
    public boolean cancel()
    {
        try
        {
            writer.close();
        }
        catch (IOException e)
        {
            log.error("An exception has occurred: "+ e, e );
        }
        return super.cancel();
    }

    @Override
    public void run()
    {
        iterations++;

        if (iterations > 24 * 60)
        {
            timer.cancel();
            twitterStream.cleanUp();
            twitterStream.shutdown();
            summary();
            log.info("Shutdown");
        }
        summary();
    }

    private void header()
    {
        Vector<String> v = new Vector<String>();
        v.add("Time");
        for (String keyword : listener.getArgs())
        {
            v.add(keyword);
        }
        writer.writeNext(v.toArray(new String[] {}));
        try
        {
            writer.flush();
        }
        catch (IOException e)
        {
            log.error("An exception has occurred: "+ e, e );
        }
    }

    /**
     * Print the summary data.
     */
    private void summary()
    {
        Vector<String> v = new Vector<String>();
        v.add(sdf.format(new Date(System.currentTimeMillis())));
        for (String keyword : listener.getArgs())
        {
            v.add(listener.get(keyword).toString());
            log.info(String.format("%s %d %%%.2f", keyword,
                    listener.get(keyword),
                    ((listener.get(keyword) * 100.0) / listener.getCount())));
        }
        writer.writeNext(v.toArray(new String[] {}));
        try
        {
            writer.flush();
        }
        catch (IOException e)
        {
            log.error("An exception has occurred: "+ e, e );
        }
        log.info("Total tweets: " + listener.getCount());
    }
}
