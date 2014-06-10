package ca.blackperl;

import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Appender;
import org.apache.log4j.DailyRollingFileAppender;
import org.apache.log4j.Layout;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;

/**
 * Main class, this should be invoked from Eclipse or via:
 * 
 * java ca.blackperl.WordFilterStreamLauncher
 */
public class WordFilterStreamLauncher
{
    private static final Log log = LogFactory
            .getLog(WordFilterStreamLauncher.class);

    public static void main(String[] args)
    {
        runMainMethod();
    }

    /**
     * 
     */
    private static void runMainMethod()
    {
        try
        {
            // Create a word filter stream object, and initialize it with
            // the
            // search phrases.
            WordFilterStreamBuilder wordStream = new WordFilterStreamBuilder(
                    new String[] { "Emma Stone" });
            
            // Start the search
            wordStream.main();
        }
        catch (Exception e)
        {
            log.error("Exception occurred - " + e.getMessage());
        }
    }
}
